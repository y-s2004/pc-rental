import React from 'react';

export default function UserDetailModal({
    show,
    detailUser,
    editMode,
    editUser,
    setEditUser,
    setEditMode,
    setDetailUser,
    handleDelete,
    handleUpdate,
    genderOptions,
    accountLevelOptions,
    editError,
    styles,
}) {
    if (!show || !detailUser) return null;

    return (
        <div className={styles.modalOverlay} onClick={() => setDetailUser(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h2 className={styles.detailTitle}>ユーザ詳細</h2>
                <div className={styles.detailGrid}>
                    <div className={styles.detailLabel}>社員番号</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input value={editUser.employee_no} disabled />
                        : detailUser.employee_no}
                    </div>
                    <div className={styles.detailLabel}>名前</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input value={editUser.name} onChange={e => setEditUser(u => ({...u, name: e.target.value}))} />
                        : detailUser.name}
                    </div>
                    <div className={styles.detailLabel}>名前カナ</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input value={editUser.name_kana} onChange={e => setEditUser(u => ({...u, name_kana: e.target.value}))} />
                        : detailUser.name_kana}
                    </div>
                    <div className={styles.detailLabel}>部署</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input value={editUser.department} onChange={e => setEditUser(u => ({...u, department: e.target.value}))} />
                        : detailUser.department}
                    </div>
                    <div className={styles.detailLabel}>電話番号</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input value={editUser.tel_no} onChange={e => setEditUser(u => ({...u, tel_no: e.target.value}))} />
                        : detailUser.tel_no}
                    </div>
                    <div className={styles.detailLabel}>メールアドレス</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input value={editUser.mail_address} onChange={e => setEditUser(u => ({...u, mail_address: e.target.value}))} />
                        : detailUser.mail_address}
                    </div>
                    <div className={styles.detailLabel}>年齢</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input type="number" value={editUser.age} onChange={e => setEditUser(u => ({...u, age: e.target.value}))} />
                        : detailUser.age}</div>
                    <div className={styles.detailLabel}>性別</div>
                    <div className={styles.detailValue}>: {editMode
                            ? (
                                <select value={editUser.gender} onChange={e => setEditUser(u => ({...u, gender: e.target.value}))}>
                                {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            )
                            : (typeof detailUser.gender === 'number'
                                ? (detailUser.gender === 0 ? '男性' : detailUser.gender === 1 ? '女性' : 'その他')
                                : detailUser.gender)
                        }
                    </div>
                    <div className={styles.detailLabel}>役職</div>
                    <div className={styles.detailValue}>: {editMode
                        ? <input value={editUser.position} onChange={e => setEditUser(u => ({...u, position: e.target.value}))} />
                        : detailUser.position}
                    </div>
                    <div className={styles.detailLabel}>アカウントレベル</div>
                    <div className={styles.detailValue}>: {editMode
                        ? (
                            <select value={editUser.account_level} onChange={e => setEditUser(u => ({...u, account_level: e.target.value, password: ''}))}>
                            {accountLevelOptions.map(level => <option key={level} value={level}>{level}</option>)}
                            </select>
                        )
                        : detailUser.account_level}
                    </div>
                    {editMode && editUser.account_level === '管理者' && (
                        <>
                            <div className={styles.detailLabel}>パスワード</div>
                            <div className={styles.detailValue}>: <input
                            type="password"
                            value={editUser.password || ''}
                            onChange={e => setEditUser(u => ({...u, password: e.target.value}))}
                            required
                            /></div>
                        </>
                    )}
                    <div className={styles.detailLabel}>登録日</div>
                    <div className={styles.detailValue}>
                        : {detailUser.register_date
                            ? new Date(detailUser.register_date).toLocaleDateString('ja-JP', {year: 'numeric', month: '2-digit', day: '2-digit'})
                            : ''}
                    </div>
                    {detailUser.update_date && (
                        <>
                            <div className={styles.detailLabel}>最終更新日</div>
                            <div className={styles.detailValue}>
                                : {new Date(detailUser.update_date).toLocaleDateString('ja-JP', {year: 'numeric', month: '2-digit', day: '2-digit'})}
                            </div>
                        </>
                    )}
                </div>
                <div className={styles.detailBtnGroup}>
                    <button className={styles.deleteBtn} onClick={handleDelete}>削除</button>
                    {editMode ? (
                        <button className={styles.updateBtn} onClick={handleUpdate}>保存</button>
                    ) : (
                        <button className={styles.updateBtn} onClick={() => setEditMode(true)}>更新</button>
                    )}
                
                    <BackButton
                        type="button"
                        className={styles.closeBtn}
                        onClick={() => {
                            setDetailUser(null);
                            setEditMode(false);
                        }}
                    >
                        戻る
                    </BackButton>
                </div>
                {editError && <div className={styles.errorMsg}>{editError}</div>}
            </div>
        </div>
    );
}