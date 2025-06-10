import React from 'react';

export default function ReturnTable({ devices, styles, formatDate, handleReturn }) {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>資産番号</th>
                    <th>社員番号</th>
                    <th>社員名</th>
                    <th>貸出日</th>
                    <th>返却期限</th>
                    <th>返却</th>
                </tr>
            </thead>
            <tbody>
                {devices.map(device => (
                    <tr key={device.asset_num}>
                        <td>{device.asset_num}</td>
                        <td>{device.user_no}</td>
                        <td>{device.name}</td>
                        <td>{formatDate(device.rental_date)}</td>
                        <td>{formatDate(device.return_date)}</td>
                        <td>
                            <button
                                className={styles.rentalBtn}
                                onClick={() => handleReturn(device)}
                            >
                                返却
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}