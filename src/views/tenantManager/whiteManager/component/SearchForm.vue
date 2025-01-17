<template>
  <el-form
    ref="formRef"
    :inline="true"
    :model="form"
    class="search-form bg-bg_color w-[99/100] pl-8 pt-[12px]"
  >
    <el-form-item :label="`${t('商户名称')}:`" prop="id">
      <el-select
        v-model="form.tenantId"
        :placeholder="t('请选择')"
        clearable
        filterable
        class="!w-[150px]"
      >
        <el-option
          :value="item.id"
          :label="item.name"
          v-for="item in tenantList"
          :key="item.id"
        />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('商户编号/ID')}:`" prop="tenantCode">
      <el-input
        v-model="form.tenantCode"
        :placeholder="t('请输入商户编号或ID')"
        clearable
        maxlength="20"
        v-enter="search"
        class="!w-[200px]"
      />
    </el-form-item>

    <el-form-item :label="`${t('商户类型')}:`" prop="status">
      <el-select v-model="form.status" clearable class="!w-[150px]">
        <el-option :label="t('全部')" :value="' '" />
        <el-option :label="t('禁用')" :value="0" />
        <el-option :label="t('启用')" :value="1" />
      </el-select>
    </el-form-item>

    <el-form-item :label="`${t('商户对接人')}:`" prop="createdBy">
      <el-input
        v-model="form.createdBy"
        :placeholder="t('请输入商户对接人')"
        clearable
        maxlength="20"
        v-enter="search"
        class="!w-[200px]"
      />
    </el-form-item>

    <el-form-item prop="createTimeStart" :label="`${t('创建时间')}:`">
      <el-date-picker
        class="!w-[240px]"
        type="daterange"
        v-model="selectDate"
        :start-placeholder="t('开始时间')"
        :end-placeholder="t('结束时间')"
        @change="changeDate"
      />
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        :icon="useRenderIcon(SearchIcon)"
        :loading="loading"
        @click="search"
      >
        {{ t('查询') }}
      </el-button>
      <el-button :icon="useRenderIcon(RefreshIcon)" @click="resetForm(formRef)">
        {{ t('重置') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { t } from '@/plugins/i18n';
import SearchIcon from '@iconify-icons/ep/search';
import RefreshIcon from '@iconify-icons/ep/refresh';
import { useRenderIcon } from '@/components/ReIcon/src/hooks';
import { type FormInstance } from 'element-plus';
import { searchFormType } from '../utils/types';
import dayjs from 'dayjs';

const props = defineProps<{
  loading: boolean;
  form: searchFormType;
  tenantList: TenantAPI.getAllSimplifiedTenant[];
}>();
const selectDate = ref('');
const formRef = ref();
const emits = defineEmits(['onSearch']);

const resetForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields();
  props.form.startCreatedAt = '';
  props.form.endCreatedAt = '';
  selectDate.value = '';
  search();
};

const search = () => {
  emits('onSearch', ...['reload']);
};

const changeDate = t => {
  if (!t) {
    props.form.startCreatedAt = '';
    props.form.endCreatedAt = '';
  } else {
    props.form.startCreatedAt = dayjs(t[0])
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss');
    props.form.endCreatedAt = dayjs(t[1])
      .endOf('day')
      .format('YYYY-MM-DD HH:mm:ss');
  }
  search();
};
</script>

<style scoped lang="scss">
:deep(.el-dropdown-menu__item i) {
  margin: 0;
}
.search-form {
  :deep(.el-form-item) {
    margin-bottom: 12px;
  }
}
</style>
