import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'node:path';
import fs from 'node:fs';
import { Storage } from './src/db/storage';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Serve synthetic downloadable APK files
  app.get('/downloads/:filename', (req, res) => {
    const filename = req.params.filename;
    
    // Check maintenance mode
    const settings = Storage.getSettings();
    if (settings.maintenanceMode) {
      return res.status(503).send('Downloads temporarily disabled due to scheduled system maintenance.');
    }

    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    const dummyApkContent = Buffer.from(
      `ROIGROUPES_VERIFIED_MOBILE_APK_PACKAGE\nPackage: ${filename}\nTimestamp: ${new Date().toISOString()}\nChecksum: SHA256_VERIFIED_48A9C2\nStatus: SIGNED_PRODUCTION_RELEASE\n`
    );
    res.send(dummyApkContent);
  });

  // REST API Routes
  // 1. Apps API
  app.get('/api/apps', (req, res) => {
    const isAdmin = req.query.admin === 'true';
    const apps = Storage.getApps(isAdmin);
    res.json({ success: true, apps });
  });

  app.get('/api/apps/:id', (req, res) => {
    const appItem = Storage.getAppById(req.params.id);
    if (!appItem) {
      return res.status(404).json({ success: false, error: 'App not found' });
    }
    res.json({ success: true, app: appItem });
  });

  app.post('/api/apps/:id/download', (req, res) => {
    try {
      const result = Storage.incrementDownload(req.params.id, req.ip || '127.0.0.1');
      res.json({
        success: true,
        downloads: result.newCount,
        app: result.app,
        downloadUrl: result.app.apkUrl,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.post('/api/apps', (req, res) => {
    try {
      const newApp = Storage.createApp(req.body);
      res.status(201).json({ success: true, app: newApp });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.put('/api/apps/:id', (req, res) => {
    try {
      const updated = Storage.updateApp(req.params.id, req.body);
      res.json({ success: true, app: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/apps/:id', (req, res) => {
    const deleted = Storage.deleteApp(req.params.id);
    res.json({ success: deleted });
  });

  // 2. Banners API
  app.get('/api/banners', (req, res) => {
    const activeOnly = req.query.all !== 'true';
    const banners = Storage.getBanners(activeOnly);
    res.json({ success: true, banners });
  });

  app.post('/api/banners', (req, res) => {
    try {
      const banner = Storage.createBanner(req.body);
      res.status(201).json({ success: true, banner });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.put('/api/banners/:id', (req, res) => {
    try {
      const updated = Storage.updateBanner(req.params.id, req.body);
      res.json({ success: true, banner: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/banners/:id', (req, res) => {
    const deleted = Storage.deleteBanner(req.params.id);
    res.json({ success: deleted });
  });

  // 3. Admin Authentication
  app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    if ((email === 'admin@roigroupes.io' || email === 'admin') && password === 'admin123') {
      res.json({
        success: true,
        admin: {
          email: 'admin@roigroupes.io',
          name: 'Roigroupes.Com Superadmin',
          role: 'Super Admin',
          token: `session-${Date.now()}-auth-token`,
        },
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }
  });

  // 4. Subscriptions & Members API
  app.get('/api/users', (_req, res) => {
    const subscriptions = Storage.getSubscriptions();
    res.json({ success: true, subscriptions });
  });

  app.post('/api/subscriptions', (req, res) => {
    try {
      const sub = Storage.createSubscription(req.body);
      res.status(201).json({ success: true, subscription: sub });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.put('/api/subscriptions/:id', (req, res) => {
    try {
      const updated = Storage.updateSubscription(req.params.id, req.body);
      res.json({ success: true, subscription: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/subscriptions/:id', (req, res) => {
    const deleted = Storage.deleteSubscription(req.params.id);
    res.json({ success: deleted });
  });

  // 5. Invoices API
  app.get('/api/invoices', (_req, res) => {
    const invoices = Storage.getInvoices();
    res.json({ success: true, invoices });
  });

  app.post('/api/invoices', (req, res) => {
    try {
      const inv = Storage.createInvoice(req.body);
      res.status(201).json({ success: true, invoice: inv });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.put('/api/invoices/:id', (req, res) => {
    try {
      const updated = Storage.updateInvoice(req.params.id, req.body);
      res.json({ success: true, invoice: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.delete('/api/invoices/:id', (req, res) => {
    const deleted = Storage.deleteInvoice(req.params.id);
    res.json({ success: deleted });
  });

  // 6. Support & Feedback Tickets API
  app.get('/api/contact', (_req, res) => {
    const tickets = Storage.getTickets();
    res.json({ success: true, tickets });
  });

  app.post('/api/contact', (req, res) => {
    try {
      const ticket = Storage.createTicket(req.body);
      res.status(201).json({ success: true, ticket });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  app.put('/api/contact/:id', (req, res) => {
    try {
      const updated = Storage.updateTicket(req.params.id, req.body);
      res.json({ success: true, ticket: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // 7. System Settings API
  app.get('/api/settings', (_req, res) => {
    const settings = Storage.getSettings();
    res.json({ success: true, settings });
  });

  app.put('/api/settings', (req, res) => {
    try {
      const updated = Storage.updateSettings(req.body);
      res.json({ success: true, settings: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // 8. Audit Logs API
  app.get('/api/audit-logs', (_req, res) => {
    const logs = Storage.getAuditLogs();
    res.json({ success: true, auditLogs: logs });
  });

  // 9. Analytics API
  app.get('/api/analytics', (_req, res) => {
    const analytics = Storage.getAnalytics();
    res.json({ success: true, analytics });
  });

  // Vite Integration for Dev / Production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Roigroupes.Com Portal Server running on http://localhost:${PORT}`);
  });
}

startServer();
