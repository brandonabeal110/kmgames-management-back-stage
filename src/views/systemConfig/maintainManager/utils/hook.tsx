import { message } from '@/utils/message';
import type { PaginationProps } from '@pureadmin/table';
import { reactive, ref, onMounted } from 'vue';
import { ElMessageBox } from 'element-plus';

export function useMaintainHook() {
  const dataList = reactive<SysTemConfigAPI.sysMainList[]>([]);
  const loading = ref(true);

  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  //- 初始化
  async function onSearch(type?: string) {
    if (type === 'reload') pagination.currentPage = 1;
    try {
      loading.value = true;
      const res = await API.sysMaintainList();
      loading.value = false;
      if (res.code) return message(res.msg, { type: 'error' });
      dataList.length = 0;
      dataList.push(...res.data.list);
      dataList.forEach(item => (item.status = item.status === 1));
      pagination.total = res.data.total;
    } catch (error) {
      loading.value = false;
    }
  }

  //- 修改启用状态
  const updateUserStatus = async (row: SysTemConfigAPI.sysMainList) => {
    return new Promise<boolean>((resolve, reject) => {
      ElMessageBox.confirm(
        +row.status === 1
          ? t('确定要关闭维护状态么？')
          : t('确定开启维护状态么?'),
        t('警告'),
        {
          center: true,
          type: 'warning'
        }
      )
        .then(async () => {
          const res = await API.sysMaintainUpdateStatus({
            status: +row.status === 0 ? 1 : 0,
            id: row.id
          });
          if (res.code) {
            reject();
          } else {
            resolve(true);
            onSearch();
          }
          message(res.msg, { type: res.code ? 'error' : 'success' });
        })
        .catch(reject);
    });
  };

  onMounted(() => {
    onSearch();
  });

  return {
    loading,
    dataList,
    onSearch,
    updateUserStatus
  };
}