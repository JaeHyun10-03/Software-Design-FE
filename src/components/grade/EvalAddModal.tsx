import React from "react";
import { Modal } from "@/components/shared/Modal";
import { EvalAddForm } from "@/components/grade/EvalAddForm";

interface EvalAddModalProps {
  open: boolean;
  value: {
    title: string;
    examType: "WRITTEN" | "PRACTICAL";
    weight: number | null;
    fullScore: number | null;
  };
  onChange: (v: Partial<EvalAddModalProps["value"]>) => void;
  onAdd: () => void;
  onCancel: () => void;
}

export function EvalAddModal({ open, value, onChange, onAdd, onCancel }: EvalAddModalProps) {
  return (
    <Modal open={open} onClose={onCancel}>
      <EvalAddForm
        value={value}
        onChange={onChange}
        onAdd={onAdd}
        onCancel={onCancel}
      />
    </Modal>
  );
}
