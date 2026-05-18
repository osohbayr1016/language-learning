import React, { useCallback, useState } from 'react';
import { Dialog } from '../../primitives/Dialog';

export function useAdminLessonImportSuccess() {
  const [visible, setVisible] = useState(false);
  const [lessonId, setLessonId] = useState<number | null>(null);

  const show = useCallback((id: number) => {
    setLessonId(id);
    setVisible(true);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    setLessonId(null);
  }, []);

  return { visible, lessonId, show, dismiss };
}

type DialogProps = {
  visible: boolean;
  lessonId: number | null;
  onClose: () => void;
};

export function AdminLessonImportSuccessDialog({ visible, lessonId, onClose }: DialogProps) {
  return (
    <Dialog
      visible={visible}
      title="Амжилттай"
      message={lessonId != null ? `Lesson #${lessonId}` : undefined}
      onClose={onClose}
    />
  );
}
