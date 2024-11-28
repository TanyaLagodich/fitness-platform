<script setup lang="ts">
import { defineProps } from 'vue';
import type { Client } from '@/types';

const props = defineProps<{ client: Client }>();
</script>

<template>
  <el-card v-if="props.client">
    <template #header>
      <div class="card-header">
        <el-text size="large" tag="b">
          {{ props.client.name }}
        </el-text>
      </div>
    </template>
    <el-text>
      {{ props.client.notes }}
    </el-text>
  </el-card>
</template>
