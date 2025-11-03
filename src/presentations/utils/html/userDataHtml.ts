import {ICurrentUser, ICurrentUserApproval, ICurrentUserDivisionInfo} from '@app/models/eplant/User'

export const constructHtmlBodyToPdf = (currentUser?: ICurrentUser) => {
  const firstSection = `
    <h4>Data Karyawan</h4>
    <div>
    <div style="justify-content: space-between; display: flex; flex-direction: row;">
        <div style="display: flex; flex: 1;">
            <p>NIP</p>
        </div>
        <div style="display: flex; flex: 1;">
            <p>: ${currentUser?.nip || '-'}</p>
        </div>
    </div>
    <div style="justify-content: space-between; display: flex; flex-direction: row;">
        <div style="display: flex; flex: 1;">
            <p>Nama Karyawan</p>
        </div>
        <div style="display: flex; flex: 1;">
            <p>: ${currentUser?.name || '-'}</p>
        </div>
    </div>
    <div style="justify-content: space-between; display: flex; flex-direction: row;">
        <div style="display: flex; flex: 1;">
            <p>Alamat</p>
        </div>
        <div style="display: flex; flex: 1;">
            <p>: ${currentUser?.address || '-'}
            </p>
        </div>
    </div>
    <div style="justify-content: space-between; display: flex; flex-direction: row;">
        <div style="display: flex; flex: 1;">
            <p>Nomor Telepon</p>
        </div>
        <div style="display: flex; flex: 1;">
            <p>: ${currentUser?.phoneNumber || '-'}</p>
        </div>
    </div>
    <div style="justify-content: space-between; display: flex; flex-direction: row;">
        <div style="display: flex; flex: 1;">
            <p>Email</p>
        </div>
        <div style="display: flex; flex: 1;">
            <p>: ${currentUser?.email || '-'}</p>
        </div>
    </div>
    <div style="justify-content: space-between; display: flex; flex-direction: row;">
        <div style="display: flex; flex: 1;">
            <p>Peran</p>
        </div>
        <div style="display: flex; flex: 1;">
            <p>: ${currentUser?.role?.name || '-'}</p>
        </div>
    </div>
    <div style="justify-content: space-between; display: flex; flex-direction: row;">
        <div style="display: flex; flex: 1;">
            <p>Jenis Karyawan</p>
        </div>
        <div style="display: flex; flex: 1;">
            <p>: ${currentUser?.typeEmployee?.name || '-'}</p>
        </div>
    </div>
    <div style="justify-content: space-between; display: flex; flex-direction: row;">
        <div style="display: flex; flex: 1;">
            <p>Kata Sandi</p>
        </div>
        <div style="display: flex; flex: 1;">
            <p>: ${currentUser?.passwordGenerate || '********'}</p>
        </div>
    </div>
</div>
    `

  const secondSection = () => {
    const map = currentUser?.approvals?.map((a: ICurrentUserApproval) => {
      const nameApprover = a?.name || '-'
      const role = a?.role?.name || '-'
      return `
        <div style="justify-content: space-between; display: flex; flex-direction: row;">
        <div style="display: flex; flex: 1; flex-direction: column; ">
            <div>
                <p style="color: gray; ">Nama Penanggung Jawab</p>
                <p>${nameApprover}</p>
            </div>
        </div>
        <div style="display: flex; flex: 1;">
            <div>
                <p style="color: gray; ">Peran</p>
                <p>${role}</p>
            </div>
        </div>
    </div>`
    })

    if (map) {
      return `
          <h4>Penanggung Jawab</h4>
          <div>
          ${map.map(v => v)}
          </div>
          `
    }
    return ''
  }

  const constructTableData = () => {
    const workingDivisions = currentUser?.userDivisions || []
    const organizationsUnique: {id: string; name: string}[] = []
    workingDivisions.forEach((w: ICurrentUserDivisionInfo) => {
      const isExists = organizationsUnique.find(o => o.id == w.division?.organization?.id)
      if (!isExists) {
        organizationsUnique.push({id: w.division?.organization?.id, name: w.division?.organization?.name})
      }
    })

    const dataTables: string[][] = []
    organizationsUnique.forEach((o: {id: string; name: string}) => {
      const temps: string[] = []
      workingDivisions.forEach((w: ICurrentUserDivisionInfo) => {
        if (w.division?.organization?.id == o.id) {
          temps.push(w.division?.name)
        }
      })
      const divisionNames = temps.join(',')
      dataTables.push([o.name, divisionNames])
    })
    return dataTables
  }

  const thirdSection = () => {
    const map = constructTableData().map((data: string[]) => {
      return `
        <div style="justify-content: space-between; display: flex; flex-direction: row;">
        <div style="display: flex; flex: 1; flex-direction: column; ">
            <div>
                <p style="color: gray; ">Nama Organisasi</p>
                <p>${data[0]}</p>
            </div>
        </div>
        <div style="display: flex; flex: 1;">
            <div>
                <p style="color: gray; ">Divisi</p>
                <p>${data[1]}</p>
            </div>
        </div>
    </div>
        `
    })

    if (map) {
      return `
        <h4>Lingkup Kerja</h4>
        <div>
        ${map.map(v => v)}
        </div>
        `
    }
    return ''
  }

  return `
  <!DOCTYPE html>

  <body style="padding: 1.5em;">
    ${firstSection}
    ${secondSection()}
    ${thirdSection()}
    
  </body>
  `
}
