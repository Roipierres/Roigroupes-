import React, { useState } from 'react';
import { InvoiceItem } from '../../types';
import { Search, Plus, DollarSign, Printer, Download, Filter, Trash2, Edit, Save, X, CheckCircle2, Clock } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface InvoicesManagementViewProps {
  invoices: InvoiceItem[];
  onRefresh: () => void;
}

export const InvoicesManagementView: React.FC<InvoicesManagementViewProps> = ({
  invoices,
  onRefresh,
}) => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<InvoiceItem | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Partial<InvoiceItem> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredInvoices = invoices.filter(i => {
    const matchesSearch = i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          i.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || i.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleOpenCreate = () => {
    setEditingInvoice({
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      userName: '',
      userEmail: '',
      planTier: 'Pro',
      amount: 89.99,
      tax: 9.00,
      total: 98.99,
      paymentMethod: 'Credit Card',
      status: 'Paid',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
    });
    setIsCreating(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice || !editingInvoice.userName) return;

    try {
      if (isCreating) {
        await fetch('/api/invoices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingInvoice),
        });
      } else if (editingInvoice.id) {
        await fetch(`/api/invoices/${editingInvoice.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingInvoice),
        });
      }
      setEditingInvoice(null);
      onRefresh();
    } catch (err) {
      console.error('Failed to save invoice:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this invoice record?')) return;
    try {
      await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (err) {
      console.error('Failed to delete invoice:', err);
    }
  };

  const handleUpdateStatus = async (invoice: InvoiceItem, newStatus: 'Paid' | 'Pending' | 'Refunded' | 'Overdue') => {
    try {
      await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      onRefresh();
    } catch (err) {
      console.error('Failed to update invoice status:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('invoicesTitle')}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('invoicesDesc')}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shrink-0"
        >
          <Plus size={16} />
          <span>{t('createInvoiceBtn')}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by invoice # or customer..."
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4">{t('invoiceNumberCol')}</th>
                <th className="px-6 py-4">{t('userCol')}</th>
                <th className="px-6 py-4">{t('amountCol')}</th>
                <th className="px-6 py-4">{t('totalCol')}</th>
                <th className="px-6 py-4">{t('statusCol')}</th>
                <th className="px-6 py-4">{t('paymentMethodCol')}</th>
                <th className="px-6 py-4 text-right">{t('actionsCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-white">{inv.userName}</div>
                    <span className="text-[11px] text-slate-400">{inv.userEmail}</span>
                  </td>

                  <td className="px-6 py-4 font-mono text-[11px]">
                    ${inv.amount.toFixed(2)} + ${inv.tax.toFixed(2)} Tax
                  </td>

                  <td className="px-6 py-4 font-mono font-extrabold text-blue-600 dark:text-cyan-400 text-sm">
                    ${inv.total.toFixed(2)}
                  </td>

                  <td className="px-6 py-4">
                    <select
                      value={inv.status}
                      onChange={(e) => handleUpdateStatus(inv, e.target.value as any)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                          : inv.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                      }`}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Refunded">Refunded</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </td>

                  <td className="px-6 py-4">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-[11px] font-medium">
                      {inv.paymentMethod}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedInvoiceForPrint(inv)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                        title="Print / View Receipt"
                      >
                        <Printer size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Receipt Modal */}
      {selectedInvoiceForPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-white text-slate-900 p-8 shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedInvoiceForPrint(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 p-1"
            >
              <X size={20} />
            </button>

            <div className="border-b pb-4 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">AetherOps Billing Receipt</h3>
                <span className="text-xs font-mono text-slate-500">{selectedInvoiceForPrint.invoiceNumber}</span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {selectedInvoiceForPrint.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Billed To</span>
                <span className="font-bold text-sm block">{selectedInvoiceForPrint.userName}</span>
                <span className="text-slate-500">{selectedInvoiceForPrint.userEmail}</span>
              </div>
              <div>
                <span className="text-slate-400 block uppercase text-[10px] font-bold">Payment Details</span>
                <span className="font-medium block">{selectedInvoiceForPrint.paymentMethod}</span>
                <span className="text-slate-500 font-mono">Date: {selectedInvoiceForPrint.issueDate}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between font-bold">
                <span>{selectedInvoiceForPrint.planTier} License Subscription</span>
                <span>${selectedInvoiceForPrint.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax & Platform Fee</span>
                <span>${selectedInvoiceForPrint.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm border-t pt-2 text-slate-900">
                <span>Total Amount Paid</span>
                <span>${selectedInvoiceForPrint.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2"
            >
              <Printer size={16} />
              <span>Print Customer Receipt</span>
            </button>
          </div>
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-slate-900 dark:text-white space-y-5">
            <button
              onClick={() => setEditingInvoice(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-bold">{isCreating ? t('createInvoiceBtn') : 'Edit Invoice Record'}</h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Customer Name</label>
                <input
                  type="text"
                  required
                  value={editingInvoice.userName || ''}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, userName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Customer Email</label>
                <input
                  type="email"
                  required
                  value={editingInvoice.userEmail || ''}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, userEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Subtotal ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingInvoice.amount || 0}
                    onChange={(e) => {
                      const amt = parseFloat(e.target.value) || 0;
                      const tax = Math.round(amt * 0.1 * 100) / 100;
                      setEditingInvoice({ ...editingInvoice, amount: amt, tax, total: amt + tax });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Total Invoice ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    readOnly
                    value={editingInvoice.total || 0}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-cyan-400 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">{t('paymentMethodCol')}</label>
                <select
                  value={editingInvoice.paymentMethod || 'Credit Card'}
                  onChange={(e) => setEditingInvoice({ ...editingInvoice, paymentMethod: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-700 bg-slate-950 text-white"
                >
                  <option value="Credit Card">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Google Pay">Google Pay</option>
                  <option value="Bank Wire">Bank Wire</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center gap-2 shadow-md"
              >
                <Save size={16} />
                <span>Save Invoice Record</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
