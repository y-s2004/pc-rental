import React from 'react';

export default function UserFormModal({
    show,
    newUser,
    handleInputChange,
    handleSubmit,
    handleCloseForm,
    genderOptions,
    accountLevelOptions,
    styles,
    formError,
    confirmPassword,
    setConfirmPassword,
    confirmError,
}) {
    if (!show) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleCloseForm}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h2>新規ユーザ登録</h2>
                {formError && (
                    <p style={{ color: 'red', marginBottom: '1rem' }}>{formError}</p>
                )}
                {confirmError && (
                    <p style={{ color: 'red', marginBottom: '1rem' }}>{confirmError}</p>
                )}
                <form onSubmit={handleSubmit} className={styles.form} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'center' }}>
                    <input
                        name="employee_no"
                        placeholder="社員番号"
                        value={newUser.employee_no}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                    />
                    <input
                        name="name"
                        placeholder="名前"
                        value={newUser.name}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                    />
                    <input
                        name="name_kana"
                        placeholder="名前カナ"
                        value={newUser.name_kana}
                        onChange={handleInputChange}
                        className={styles.formInput}
                    />
                    <input
                        name="department"
                        placeholder="部署"
                        value={newUser.department}
                        onChange={handleInputChange}
                        className={styles.formInput}
                    />
                    <input
                        name="tel_no"
                        placeholder="電話番号"
                        value={newUser.tel_no}
                        onChange={handleInputChange}
                        className={styles.formInput}
                    />
                    <input
                        name="mail_address"
                        placeholder="メールアドレス"
                        value={newUser.mail_address}
                        onChange={handleInputChange}
                        className={styles.formInput}
                    />
                    <input
                        name="age"
                        type="number"
                        placeholder="年齢"
                        value={newUser.age}
                        onChange={handleInputChange}
                        className={styles.formInput}
                    />
                    <input
                        name="position"
                        placeholder="役職"
                        value={newUser.position}
                        onChange={handleInputChange}
                        className={styles.formInput}
                    />
                    <select
                        name="gender"
                        value={newUser.gender}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                    >
                        <option value="">性別を選択</option>
                        {genderOptions.map(g => (
                            <option key={g} value={g}>{g}</option>
                        ))}
                    </select>
                    <select
                        name="account_level"
                        value={newUser.account_level}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                    >
                        <option value="">アカウントレベルを選択</option>
                        {accountLevelOptions.map(level => (
                            <option key={level} value={level}>{level}</option>
                        ))}
                    </select>
                    <input
                        name="password"
                        type="password"
                        placeholder="パスワード"
                        value={newUser.password}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                    />
                    <input
                        name="confirm_password"
                        type="password"
                        placeholder="パスワード再入力"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className={styles.formInput}
                        required
                    />
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