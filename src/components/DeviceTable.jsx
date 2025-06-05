import React from 'react';

export default function DeviceTable({
  devices,
  styles,
  showRental = false,
  showDetail = false,
  onRental,
  onDetail,
}) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>資産番号</th>
          <th>メーカー</th>
          <th>OS</th>
          <th>メモリ</th>
          <th>容量</th>
          <th>備考</th>
          {showDetail && <th>詳細</th>}
          {showRental && <th>貸出</th>}
        </tr>
      </thead>
      <tbody>
        {devices.map(device => (
          <tr key={device.asset_num}>
            <td>{device.asset_num}</td>
            <td>{device.maker}</td>
            <td>{device.os}</td>
            <td>{device.memory}</td>
            <td>{device.disc_capacity}</td>
            <td>{device.remarks}</td>
            {showDetail && (
              <td>
                <button
                  className={styles.detailBtn}
                  onClick={() => onDetail(device)}
                >
                  詳細
                </button>
              </td>
            )}
            {showRental && (
              <td>
                <button
                  className={styles.rentalBtn}
                  onClick={() => onRental(device)}
                >
                  貸出
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}