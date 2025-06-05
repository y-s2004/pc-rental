import React from 'react';

export default function RentalModal({
  show,
  rentalDevice,
  setRentalDevice,
  onSubmit,
  onClose,
  rentalMessage,
  styles,
}) {
  if (!show || !rentalDevice) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2>貸出登録</h2>
        <form onSubmit={onSubmit} className={styles.form}>
          <div>
            <label>資産番号</label>
            <input value={rentalDevice.asset_num} disabled />
          </div>
          <div>
            <label>保管場所</label>
            <input value={rentalDevice.place || ''} disabled />
          </div>
          <div>
            <label>OS</label>
            <input value={rentalDevice.os || ''} disabled />
          </div>
          <div>
            <label>メーカー</label>
            <input value={rentalDevice.maker || ''} disabled />
          </div>
          <div>
            <label>ユーザ番号</label>
            <input
              value={rentalDevice.user_no || ''}
              onChange={e => setRentalDevice({ ...rentalDevice, user_no: e.target.value })}
              required
            />
          </div>
          <div>
            <label>名前</label>
            <input
              type="text"
              value={rentalDevice.name || ''}
              onChange={e => setRentalDevice({ ...rentalDevice, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>返却予定日</label>
            <input
              type="date"
              value={rentalDevice.return_date || ''}
              onChange={e => setRentalDevice({ ...rentalDevice, return_date: e.target.value })}
              required
            />
          </div>
          <div className={styles.remarksWrapper}>
            <label>備考</label>
            <textarea
              className={styles.remarksInput}
              value={rentalDevice.remarks || ''}
              onChange={e => setRentalDevice({ ...rentalDevice, remarks: e.target.value })}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={`${styles.formButton} ${styles.orangeButton}`}>登録</button>
            <button
              type="button"
              className={`${styles.formButton} ${styles.secondaryButton}`}
              onClick={onClose}
            >
              戻る
            </button>
          </div>
        </form>
        {rentalMessage && <p>{rentalMessage}</p>}
      </div>
    </div>
  );
}