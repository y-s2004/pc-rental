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
}) {
  if (!show) return null;

  return (
    <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h2>新規ユーザ登録</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                  <label className={styles.formLabel}>社員番号</label>
                  <input
                    name="employee_no"
                    placeholder="社員番号"
                    value={newUser.employee_no}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>名前</label>
                  <input
                    name="name"
                    placeholder="名前"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>名前カナ</label>
                  <input
                    name="name_kana"
                    placeholder="名前カナ"
                    value={newUser.name_kana}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>部署</label>
                  <input
                    name="department"
                    placeholder="部署"
                    value={newUser.department}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>電話番号</label>
                  <input
                    name="tel_no"
                    placeholder="電話番号"
                    value={newUser.tel_no}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>メールアドレス</label>
                  <input
                    name="mail_address"
                    placeholder="メールアドレス"
                    value={newUser.mail_address}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>年齢</label>
                  <input
                    name="age"
                    type="number"
                    placeholder="年齢"
                    value={newUser.age}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>役職</label>
                  <input
                    name="position"
                    placeholder="役職"
                    value={newUser.position}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>性別</label>
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
                </div>
                <div>
                  <label className={styles.formLabel}>アカウントレベル</label>
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
                </div>
                {newUser.account_level === '管理者' && (
                  <div>
                    <label className={styles.formLabel}>パスワード</label>
                    <input
                      name="password"
                      type="password"
                      placeholder="パスワード"
                      value={newUser.password}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                    />
                  </div>
                )}
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