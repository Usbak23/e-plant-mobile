import {IManagementWarehouseBPU} from '@app/models/eplant/WarehouseManagement'
import numberWithDot from '../numberWithDot'

export const constructNPBHtml = (
  requestNumber: string = '-',
  requester: string = '-',
  date: string = '-',
  materialName: string = '-',
  materialQty: string = '-',
  materialDesc: string = '-',
  bpus: IManagementWarehouseBPU[] = [],
  jenisPupuk: string = '-',
  materialType: string = '',
) => {
  const headerSection = `
  <div>
    <div style="justify-content: space-between; display: flex; flex-direction: row;">
      <div style="display: flex; flex: 1;">
          <p>Tanggal: ${date}</p>
      </div>
      <div style="display: flex; flex: 1;">
          <p>Nomor Permintaan: ${requestNumber}</p>
      </div>
    </div>        
    </div>


    <div>
        <div style="justify-content: space-between; display: flex; flex-direction: row;">
            <div style="display: flex; flex: 1;">
                <p>Pengaju: ${requester}</p>
            </div>
        </div>
    </div>
    `

  const materialSection = `
  <div >
  <div style="justify-content: space-between; display: flex; ">
      <table style="border: 1px solid lightgrey; border-collapse: collapse; width: 100%;">
          <tr> 
            <th style="background-color: lightgrey; padding: 0.4em; width: 30%;">Nama Barang</th>
            <th style="background-color: lightgrey; padding: 0.4em; width: 20%;">${
              materialType == 'Uang Tunai' ? 'Jumlah' : 'Kuantitas'
            }</th>
            <th style="background-color: lightgrey; padding: 0.4em; width: 50%;">Keterangan</th>
          </tr>
          <tr>
            <td style="border: solid 2px lightgrey;   padding: 0.5em;">${materialName}</td>
            <td style="border: solid 2px lightgrey;   padding: 0.5em;">${
              materialType == 'Uang Tunai' ? `Rp.${numberWithDot(parseFloat(materialQty))}` : materialQty
            }</td>
            <td style="border: solid 2px lightgrey;   padding: 0.5em;">${materialDesc}</td>
          </tr>
        </table>
  </div>
    </div>
  `

  const optionalBPUSection = `
  <h4>Rincian BPU</h4>
  <div >
      <div style="justify-content: space-between; display: flex; ">
          <table style="border: 1px solid lightgrey; border-collapse: collapse; width: 100%;">
              <tr>
                <th style="background-color: lightgrey; padding: 0.4em;">Blok</th>
                <th style="background-color: lightgrey; padding: 0.4em;">Jenis Pupuk</th>
                <th style="background-color: lightgrey; padding: 0.4em;">Kg/Pokok</th>
                <th style="background-color: lightgrey; padding: 0.4em;">Tonase</th>
                <th style="background-color: lightgrey; padding: 0.4em;">Kg/Until</th>
              </tr>
              ${bpus.map(
                (bpu: IManagementWarehouseBPU) => `
                <tr>
                    <td style="border: solid 2px lightgrey;   padding: 0.5em;">${bpu?.block?.code || '-'}</td>
                    <td style="border: solid 2px lightgrey;   padding: 0.5em;">${jenisPupuk || '-'}</td>
                    <td style="border: solid 2px lightgrey;   padding: 0.5em;">${bpu?.kgPerPokok || '-'}</td>
                    <td style="border: solid 2px lightgrey;   padding: 0.5em;">${bpu?.tonnage || '-'}</td>
                    <td style="border: solid 2px lightgrey;   padding: 0.5em;">${bpu?.kgPerUntil || '-'}</td>
                </tr>
                `,
              )}

            </table>
      </div>
      
  </div>
  `

  const shouldShow = bpus.length > 0 ? optionalBPUSection : ''
  return `
    <!DOCTYPE html>
    <body style="padding: 1.5em;">
    <h4 style="text-align:center">Nota Pengeluaran Barang</h4>
        ${headerSection}
        ${materialSection}
        ${shouldShow}

        <div style="margin-top: 2em">
      <table style="width: 100%;">
          <tr>
            <th >Dikeluarkan oleh</th>
            <th ></th>
            <th >Diterima Oleh</th>
          </tr>
          <tr>
              <td style="padding: 2em" ></td>
              <td style="padding: 2em"></td>
              <td style="padding: 2em"></td>
            </tr>
          <tr>
            <td style="text-align: center;" ><hr style="margin-left: 1.5em; margin-right: 1.5em;"/></td>
            <td style="text-align: center;">
            <div></div></td>
            <td style="text-align: center;"><hr style="margin-left: 1.5em; margin-right: 1.5em;"/></td>
          </tr>
        </table>
  </div>
    <div style="margin-top: 2em">
      <table style="width: 100%;">
          <tr>
            <th ></th>
            <th >Mengetahui</th>
            <th ></th>
          </tr>
          <tr>
              <td style="padding: 2em" ></td>
              <td style="padding: 2em"></td>
              <td style="padding: 2em"></td>
            </tr>
          <tr>
            <td style="text-align: center;" ><hr style="margin-left: 1.5em; margin-right: 1.5em;"/></td>
            <td style="text-align: center;">
            <div></div></td>
            <td style="text-align: center;"><hr style="margin-left: 1.5em; margin-right: 1.5em;"/></td>
          </tr>
        </table>
  </div>
    </body>
    `
}
