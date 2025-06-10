
import React from 'react';

export default function DeviceForm({
        show,
        newDevice,
        handleInputChange,
        setNewDevice,
        handleSubmit,
        handleCloseForm,
        styles,
    }) {

    if (!show) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleCloseForm}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h2>新規機器登録</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                    <label className={styles.formLabel}>資産番号</label>
                    <input
                        name="asset_num"
                        placeholder="資産番号"
                        value={newDevice.asset_num}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div>
                    <label className={styles.formLabel}>メーカー</label>
                    <input
                        name="maker"
                        placeholder="メーカー"
                        value={newDevice.maker}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div>
                    <label className={styles.formLabel}>OS</label>
                    <input
                        name="os"
                        placeholder="OS"
                        value={newDevice.os}
                        onChange={handleInputChange}
                        className={styles.formInput}
                    />
                </div>
                <div>
                    <label className={styles.formLabel}>メモリ</label>
                    <input
                        name="memory"
                        placeholder="メモリ"
                        value={newDevice.memory}
                        onChange={handleInputChange}
                        className={styles.formInput}
                    />
                </div>
                <div>
                    <label className={styles.formLabel}>容量</label>
                    <input
                        name="disc_capacity"
                        placeholder="容量"
                        value={newDevice.disc_capacity}
                        onChange={handleInputChange}
                        className={styles.formInput}
                    />
                </div>
                <div>
                    <label>グラフィックボード</label>
                    <select
                        name="graphic_board"
                        value={newDevice.graphic_board}
                        onChange={e => setNewDevice({ ...newDevice, graphic_board: e.target.value === 'true' })}
                        className={styles.formInput}
                        required
                    >
                    <option value="true">⭕️</option>
                    <option value="false">❌</option>
                    </select>
                </div>
                <div>
                    <label>保管場所</label>
                    <input
                        name="place"
                        placeholder="保管場所"
                        value={newDevice.place || ''}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div>
                    <label>リース開始日</label>
                    <input
                        type="date"
                        name="rental_start"
                        value={newDevice.rental_start}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div>
                    <label>リース終了日</label>
                    <input
                        type="date"
                        name="rental_deadline"
                        value={newDevice.rental_deadline}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div>
                    <label>棚卸日</label>
                    <input
                        type="date"
                        value={newDevice.inventory_date || ''}
                        onChange={e => setNewDevice({ ...newDevice, inventory_date: e.target.value })}
                        className={styles.inventoryDateInput}
                        required
                    />
                </div>
                <div className={styles.remarksWrapper}>
                    <label>備考</label>
                    <textarea
                        className={styles.remarksInput}
                        name="remarks"
                        placeholder="備考"
                        value={newDevice.remarks || ''}
                        onChange={e => setNewDevice({ ...newDevice, remarks: e.target.value })}
                    />
                </div>
                <div className={styles.formButtonGroup}>
                    <button type="submit" className={styles.formButton}>登録</button>
                    <button
                        type="button"
                        onClick={handleCloseForm}
                        className={`${styles.formButton} ${styles.secondary}`}
                    >
                        戻る
                    </button>
                </div>
                </form>
            </div>
        </div>
    );
}