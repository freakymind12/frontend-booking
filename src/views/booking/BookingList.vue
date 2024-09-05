<template>
  <a-col :span="6">
    <a-card class="booking-card">
      <h2>Your booking list</h2>
      <a-list item-layout="horizontal" :data-source="data">
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
              description="Ant Design, a design language for background applications, is refined by Ant UED Team"
            >
              <template #title>
                <a href="https://www.antdv.com/">{{ item.title }}</a>
              </template>
              <template #avatar>
                <a-avatar src="https://joeschmoe.io/api/v1/random" />
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </a-col>
</template>

<script setup>
const data = [
  {
    title: 'Ant Design Title 1'
  },
  {
    title: 'Ant Design Title 2'
  },
  {
    title: 'Ant Design Title 3'
  },
  {
    title: 'Ant Design Title 4'
  },
  {
    title: 'Ant Design Title 4'
  },
  {
    title: 'Ant Design Title 4'
  }
]
</script>

<style scoped>
.booking-card {
  height: 600px; /* Tetapkan tinggi tetap */
  overflow-y: auto; /* Tambahkan scroll secara vertikal */
  padding-right: 8px;
  text-align: left;
}

.booking-card::-webkit-scrollbar {
  display: none; /* Menyembunyikan scrollbar */
}
</style>
