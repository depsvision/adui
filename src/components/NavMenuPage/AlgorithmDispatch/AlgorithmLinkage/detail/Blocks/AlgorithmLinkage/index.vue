<template>
  <div class="algorithm-point-block">
    <head-slot :component-option="{label:'算法联动',class: 'is-outer'}">
      <form-list :component-option="formListOption">
        <template v-slot:firstLevel>
          <div class="first-level-inner-form inner-form-layout">
            <form-list :component-option="firstLevel" />
            <button-group
              ref="buttonGroup"
              class="small-buttons"
              :component-option="firstLevelButtons"
            />
          </div>
        </template>
        <template v-slot:linkage>
          <div class="linkage-inner-form inner-form-layout">
            <form-list :component-option="linkage" />
          </div>
        </template>
      </form-list>
    </head-slot>
  </div>
</template>

<script>
import task from '@/api/task'
import mixins from './Mixins'
import HeadSlot from '@/components/Slot/HeadSlot'
import FormList from '@/components/InnerComponents/FormList'
import ButtonGroup from '@/components/Button/ButtonGroup'

export default {
  name: 'AlgorithmLinkage',
  components: { HeadSlot, FormList, ButtonGroup },
  mixins: [mixins],
  props: {
  },
  data() {
    return {
      formListOption: {
        form: [
          {
            type: 'dynamicSlot',
            label: '一级任务信息',
            prop: 'firstLevel'
          },
          {
            type: 'dynamicSlot',
            label: '联动任务信息',
            prop: 'linkage'
          }
        ],
        labelWidth: '140px',
        labelPosition: 'left'
      },
      firstLevel: {
        class: 'is-block-inner',
        data: {
          algorithmArr: []
        },
        form: [
          {
            type: 'spanAssembly',
            label: '任务类型',
            prop: 'typeName'
          },
          {
            type: 'spanAssembly',
            label: '任务ID',
            prop: 'id',
            spanTip: ''
          },
          {
            type: 'spanAssembly',
            label: '任务名称',
            prop: 'name'
          },
          {
            type: 'AutoCollapse',
            label: '联动算法',
            prop: 'algorithmArr'
          },
          {
            type: 'spanAssembly',
            label: '联动对象',
            prop: 'objectName'
          }
        ],
        labelWidth: '80px',
        labelPosition: 'right'
      },
      firstLevelButtons: {
        buttons: [
          {
            label: '编辑',
            value: 'editFirstLevel',
            plain: true
          }
        ]
      },
      linkage: {
        class: 'is-block-inner',
        data: {
          linkageAlgirithm: '',
          faceGroup: '',
          featureExtract: '',
          sceneConfig: ''
        },
        form: [
          {
            type: 'spanAssembly',
            label: '联动算法',
            prop: 'linkageAlgirithm',
            class: 'small-buttons',
            buttons: {
              buttons: [
                {
                  label: '编辑',
                  value: 'editLinkage',
                  plain: true,
                  loading: false
                }
              ]
            }
          },
          {
            type: 'spanAssembly',
            label: '特征提取',
            prop: 'featureExtract',
            class: 'small-buttons',
            hide: true,
            buttons: {
              buttons: [
                {
                  label: '设置',
                  value: 'editFeatureExtract',
                  plain: true,
                  loading: false
                }
              ]
            }
          },
          {
            type: 'spanAssembly',
            label: '场景配置',
            prop: 'sceneConfig',
            class: 'small-buttons',
            hide: true,
            buttons: {
              buttons: [
                {
                  label: '设置',
                  value: 'editSceneConfig',
                  plain: true,
                  loading: false
                }
              ]
            }
          }
          // {
          //   type: 'spanAssembly',
          //   label: '人脸分组',
          //   prop: 'faceGroup'
          // }
        ],
        labelWidth: '80px',
        labelPosition: 'right'
      },
      subList: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.getSub()
    },
    getSub() {
      task.taskSub()
        .then(res => {
          const { data } = res
          data.taskList.forEach(item => {
            item.label = item.name
            item.value = item.task_key
          })
          this.subList = data.taskList
        })
    }
  }
}
</script>

<style scoped lang="scss">
.algorithm-point-block {

  .first-level-inner-form{

    .form-list-container {
      margin-bottom: 24px;
    }
  }

  .linkage-inner-form{

    ::v-deep .head-slot-container {

      .el-form-item {
        margin-bottom: 8px;

        &:last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }

  .first-level-inner-form {
    overflow: hidden;
  }
}
</style>
