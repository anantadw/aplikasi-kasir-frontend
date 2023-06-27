<template>
  <div class="container mx-auto xl:px-20 my-8">
    <div class="flex justify-between">
      <h1 class="text-4xl font-bold">Data Transaksi</h1>
    </div>
    <div class="mt-8">
      <Spinner v-if="isLoading" />
      <table v-else class="w-full text-center table-auto shadow-md">
        <thead class="bg-slate-700 text-white">
        <tr>
          <th scope="col" class="py-2">ID</th>
          <th scope="col" class="py-2">Admin</th>
          <th scope="col" class="py-2 w-1/5">Total Harga</th>
          <th scope="col" class="py-2 w-1/5">Total Harga Dibulatkan</th>
          <th scope="col" class="py-2 w-1/5">Metode Pembayaran</th>
          <th scope="col" class="py-2">Aksi</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="transaction in transactions" class="bg-white border-b hover:bg-gray-100">
          <th scope="row" class="font-medium whitespace-nowrap">{{ transaction.id }}</th>
          <td class="py-2">{{ transaction.admin }}</td>
          <td class="py-2">Rp{{ formatNumber(transaction.total_price) }}</td>
          <td class="py-2">Rp{{ formatNumber(transaction.rounded_total_price) }}</td>
          <td class="py-2">{{ transaction.payment_method }}</td>
          <td class="py-2">
            <button type="button" class="bg-cyan-400 px-4 py-2 rounded-lg font-medium hover:bg-cyan-300 active:bg-cyan-500 transition duration-150 me-2">Detail</button>
          </td>
        </tr>
        <tr v-show="transactions.length === 0" class="bg-white border-b hover:bg-gray-100">
          <th scope="row" colspan="7" class="px-6 py-4 font-medium whitespace-nowrap text-center">Tidak ada data.</th>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Modal } from 'flowbite'
import moment from 'moment'

useHead({
  title: 'Data Transaksi'
})

const apiRoute = useRuntimeConfig().public.apiBase
const { $swal } = useNuxtApp()
const transactions = ref([])
const isLoading = ref(false)
let $modalElement, modal

onMounted(() => {
  // setup modal
  $modalElement = document.querySelector('#modal')
  const modalOptions = {
    backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    closable: false,
    onHide: () => {
    },
  }
  if ($modalElement) {
    modal = new Modal($modalElement, modalOptions)
  }

  getTransactions()
})

const getTransactions = async() => {
  isLoading.value = true
  try {
    const { data } = await $fetch(`${apiRoute}/transactions`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
    transactions.value = data
  } catch (error) {
    $swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Data transaksi gagal diambil.',
      footer: `<p>${error.data.message}</p>`
    })
  }
  isLoading.value = false
}

const formatDate = (date) => {
  return moment(date).format('DD MMMM YYYY hh:mm:ss')
}

const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number)
}
</script>