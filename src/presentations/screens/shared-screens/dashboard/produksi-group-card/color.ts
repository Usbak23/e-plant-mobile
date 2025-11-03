interface typeColor {
  bgColor: string
  bgColor1: string
  color: string
  text: string
}

export const statusColor = (status?: number): typeColor => {
  switch (status) {
    case 1: // mendekati target
      return {
        bgColor: '#FCF5E3',
        bgColor1: '#FAE9BB',
        color: '#F0B10D',
        text: 'Mendekati Target',
      }

    case 2: // mencapai target
      return {
        bgColor: '#E3FCF9',
        bgColor1: '#AAE5DD',
        color: '#00B098',
        text: 'Mencapai Target',
      }

    case 3: // melampaui target
      return {
        bgColor: '#E5F4FF',
        bgColor1: '#B0DAFB',
        color: '#3AA2F4',
        text: 'Melampaui Target',
      }
    case 4: // jauh melampaui target
      return {
        bgColor: 'rgba(13, 96, 161, 0.3)',
        bgColor1: 'rgba(13, 96, 161, 0.3)',
        color: 'rgba(13, 96, 161, 1)',
        text: 'Jauh Melampaui Target',
      }
    default:
      //0 jauh dari target
      return {
        bgColor: '#FCEFEF',
        bgColor1: '#FAD4D4',
        color: '#EF2525',
        text: 'Jauh dari Target',
      }
  }
}
