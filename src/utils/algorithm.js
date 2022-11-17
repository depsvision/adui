import { deepClone } from '@/utils'

export const handleAlarmData = (data, alert, color, fontColor, allShow, rightShow, errorShow, key) => {
  const result = []

  const dataKey = data.dataKey || 'resultData'
  const dealData = dealAlgorithmData(data, dataKey)

  let taskId = dealData.taskId
  if (key) {
    taskId = key + dealData.taskId
  }

  if (dealData && dealData[dataKey] && dealData[dataKey].objectList) {
    dealData[dataKey].objectList.forEach(svg => {
      let show = !!svg.classId

      if (allShow !== undefined && allShow !== null) {
        show = allShow.includes(taskId)
      } else if (rightShow !== undefined && rightShow !== null) {
        show = !!svg.classId && rightShow.includes(taskId)
      } else if (errorShow !== undefined && errorShow !== null) {
        show = !svg.classId && errorShow.includes(taskId)
      }

      if (svg.rect) {
        const rect = { ...svg.rect }
        rect.fill = 'none'
        rect['stroke-width'] = 2
        rect.stroke = color

        result.push({
          type: 'rectAlarm',
          rect: rect,
          text: {
            value: svg.alert || alert || '违规',
            fill: fontColor
          },
          display: show,
          taskId: dealData.taskId
        })
      }
    })
  }

  const taskKey = data.taskKey || 'taskResult'

  if (dealData && dealData[taskKey] && dealData[taskKey].objectList) {
    dealData[taskKey].objectList.forEach(task => {
      let show = !!task.classId

      if (allShow !== undefined && allShow !== null) {
        show = allShow.includes(taskId)
      } else if (rightShow !== undefined && rightShow !== null) {
        show = !!task.classId && rightShow.includes(taskId)
      } else if (errorShow !== undefined && errorShow !== null) {
        show = !task.classId && errorShow.includes(taskId)
      }

      let text = ''

      if (task.res && task.res.length) {
        text = task.res[0].name ?? alert
      } else {
        text = task.result ?? alert
      }

      if (task.rect) {
        const rect = { ...task.rect }
        rect.fill = 'none'
        rect['stroke-width'] = 2
        rect.stroke = color

        result.push({
          type: 'rectAlarm',
          rect: rect,
          text: {
            value: text || '未知',
            fill: fontColor
          },
          display: show,
          taskId: dealData.taskId
        })
      }
    })
  }

  return result
}

const dealAlgorithmData = (data, dataKey) => {
  let result = null

  if (data && data[dataKey] && data[dataKey].objectList) {
    switch (Number(data.taskId)) {
      case 3:
        data[dataKey].objectList.forEach(svg => { svg.alert = ['', '安全帽', '工作服', '安全帽和工作服'][svg.classId] })
        break
      case 5:
        data[dataKey].objectList.forEach(svg => { svg.alert = ['', '安全帽', '反光衣', '安全帽和反光衣'][svg.classId] })
        break
      case 8:
        data[dataKey].objectList.forEach(svg => { svg.alert = ['', '抽烟', '打电话'][svg.classId] })
        break
      case 23:
        data[dataKey].objectList.forEach(svg => { svg.alert = ['', '人', '车'][svg.classId] })
        break
      default:
        break
    }
  }

  result = deepClone(data)

  return result
}

export const handleRectData = (data = [], show = true) => {
  const result = []

  data.forEach(item => {
    if (item.rect) {
      const rect = { ...item.rect }

      result.push({
        svgType: item.svgType,
        type: 'rect',
        rect: rect,
        display: show
      })
    }
  })

  return result
}
