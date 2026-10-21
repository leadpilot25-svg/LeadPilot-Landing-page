import React, { useState } from 'react';
import {
  AlertTriangle,
  Trash2,
  X,
  User,
  Phone,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { LeadItem } from '../types';

interface DeleteLeadModalProps {
  isOpen: boolean;
  lead: LeadItem | null;
  onClose: () => void;
  onConfirmDelete: (lead: LeadItem) => Promise<void>;
}

export const DeleteLeadModal: React.FC<DeleteLeadModalProps> = ({
  isOpen,
  lead,
  onClose,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !lead) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      await onConfirmDelete(lead);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete lead. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-red-500/30 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Icon & Title */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Delete Lead</h2>
              <p className="text-xs text-slate-400">
                This action is scoped to tenant <span className="font-mono text-emerald-400">{lead.clientId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Details Summary Card */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-slate-400 font-mono text-[10px]">Lead ID: {lead.id}</span>
            <span className="text-amber-400 font-semibold text-[10px] bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
              {lead.status}
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center gap-2 text-slate-200">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <strong className="text-white text-sm">{lead.name}</strong>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-mono">{lead.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{lead.service}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Received: {new Date(lead.timestamp).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Warning text */}
        <p className="text-xs text-slate-400">
          Are you sure you want to delete this lead? This will remove the lead from your CRM list and synchronize deletion with your Google Sheet.
        </p>

        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-2.5 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow"
          >
            {isDeleting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
