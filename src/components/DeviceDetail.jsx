import React from 'react';

export default function DeviceDetailModal({
        show,
        detailDevice,
        editMode,
        editDevice,
        setEditDevice,
        setEditMode,
        setDetailDevice,
        handleDelete,
        handleUpdate,
        editError,
        styles,
    }) {

    if (!show || !detailDevice) return null;

    return (
        <div className={styles.modalOverlay} onClick={() => setDetailDevice(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h2 className={styles.detailTitle}>機器詳細</h2>
                <div className={styles.detailGrid}>
                    <div className={styles.detailLabel}>資産番号</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input value={editDevice.asset_num} disabled />
                        : detailDevice.asset_num}
                    </div>
                    <div className={styles.detailLabel}>メーカー</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input value={editDevice.maker} onChange={e => setEditDevice(d => ({...d, maker: e.target.value}))} />
                        : detailDevice.maker}
                    </div>
                    <div className={styles.detailLabel}>OS</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input value={editDevice.os} onChange={e => setEditDevice(d => ({...d, os: e.target.value}))} />
                        : detailDevice.os}
                    </div>
                    <div className={styles.detailLabel}>メモリ</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input value={editDevice.memory} onChange={e => setEditDevice(d => ({...d, memory: e.target.value}))} />
                        : detailDevice.memory}
                    </div>
                    <div className={styles.detailLabel}>グラフィックボード</div>
                    <div className={styles.detailValue}>
                        : {editMode ? (
                        <select
                            value={editDevice.graphic_board ? 'true' : 'false'} 
                            onChange={e => setEditDevice(d => ({ ...d, graphic_board: e.target.value === 'true' }))}
                            className={styles.remarksInputSmall}
                        >
                            <option value="true">⭕️</option>
                            <option value="false">❌</option>
                        </select>
                        ) : (
                        detailDevice.graphic_board ? '⭕️' : '❌' 
                        )}
                    </div>
                    <div className={styles.detailLabel}>保管場所</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input value={editDevice.place || ''} onChange={e => setEditDevice(d => ({...d, place: e.target.value}))} />
                        : detailDevice.place}
                    </div>
                    <div className={styles.detailLabel}>容量</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input value={editDevice.disc_capacity} onChange={e => setEditDevice(d => ({...d, disc_capacity: e.target.value}))} />
                        : detailDevice.disc_capacity}
                    </div>
                    <div className={styles.detailLabel}>備考</div>
                    <div className={styles.detailValue}>
                        : {editMode ? (
                        <input
                            className={styles.remarksInputSmall} 
                            value={editDevice.remarks || ''}
                            onChange={e => setEditDevice(d => ({ ...d, remarks: e.target.value }))}
                        />
                        ) : (
                            detailDevice.remarks || '' 
                        )}
                    </div>
                    <div className={styles.detailLabel}>棚卸日</div>
                    <div className={styles.detailValue}>
                        : {editMode ? (
                            <input
                                type="date"
                                className={styles.re} 
                                value={editDevice.inventory_date || ''} 
                                onChange={e => setEditDevice(d => ({ ...d, inventory_date: e.target.value }))}
                            />
                        ) : (
                        editDevice.inventory_date
                            ? new Date(editDevice.inventory_date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
                            : ''
                        )}
                    </div>
                    <div className={styles.detailLabel}>リース開始日</div>
                    <div className={styles.detailValue}>
                        : {detailDevice.rental_start
                            ? new Date(detailDevice.rental_start).toLocaleDateString('ja-JP', {year: 'numeric', month: '2-digit', day: '2-digit'})
                        : ''}
                    </div>
                    <div className={styles.detailLabel}>リース期限日</div>
                    <div className={styles.detailValue}>
                        : {detailDevice.rental_deadline
                            ? new Date(detailDevice.rental_deadline).toLocaleDateString('ja-JP', {year: 'numeric', month: '2-digit', day: '2-digit'})
                        : ''}
                    </div>
                    <div className={styles.detailLabel}>登録日</div>
                    <div className={styles.detailValue}>
                        : {detailDevice.registration_date
                            ? new Date(detailDevice.registration_date).toLocaleDateString('ja-JP', {year: 'numeric', month: '2-digit', day: '2-digit'})
                        : ''}
                    </div>
                    <div className={styles.detailLabel}>更新日</div>
                    <div className={styles.detailValue}>
                        : {detailDevice.update_date
                            ? new Date(detailDevice.update_date).toLocaleDateString('ja-JP', {year: 'numeric', month: '2-digit', day: '2-digit'})
                        : ''}
                    </div>
                </div>
                <div className={styles.detailBtnGroup}>
                    <button className={styles.deleteBtn} onClick={handleDelete}>削除</button>
                    {editMode ? (
                        <button className={styles.updateBtn} onClick={handleUpdate}>保存</button>
                    ) : (
                        <button className={styles.updateBtn} onClick={() => setEditMode(true)}>更新</button>
                    )}
                    <button className={styles.closeBtn} onClick={() => {
                        setDetailDevice(null);
                        setEditMode(false);
                    }}>
                        戻る
                    </button>
                </div>
                {editError && <div className={styles.errorMsg}>{editError}</div>}
            </div>
        </div>
    );
}