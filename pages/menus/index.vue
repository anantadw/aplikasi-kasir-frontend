<template>
  <div class="container mx-auto xl:px-20 my-8">
    <div class="flex justify-between">
      <h1 class="text-4xl font-bold">Data Menu</h1>
      <NuxtLink to="/menus/create" class="flex-none bg-blue-700 px-4 py-2 rounded-lg text-white hover:bg-blue-800 transition duration-150">Tambah</NuxtLink>
    </div>
    <div class="mt-8">
      <Spinner v-if="pending" />
      <table v-else class="w-full text-center table-auto shadow-md">
        <thead class="bg-slate-700 text-white">
          <tr>
            <th scope="col" class="px-6 py-2">ID</th>
            <th scope="col" class="px-6 py-2">#</th>
            <th scope="col" class="px-6 py-2 w-3/12">Nama</th>
            <th scope="col" class="px-6 py-2">Kategori</th>
            <th scope="col" class="px-6 py-2">Harga</th>
            <th scope="col" class="px-6 py-2">Status</th>
            <th scope="col" class="py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="menu in menus.data" class="bg-white border-b hover:bg-gray-100">
            <th scope="row" class="font-medium whitespace-nowrap">{{ menu.id }}</th>
            <td class="py-2">
              <img v-bind:src="menu.image" v-bind:alt="menu.name" class="w-20 mx-auto">
            </td>
            <td class="py-2">{{ menu.name }}</td>
            <td class="py-2">{{ menu.category.name }}</td>
            <td class="py-2">Rp{{ formatNumber(menu.price) }}</td>
            <td class="py-2">
              <span v-if="menu.status" class="bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">Tersedia</span>
              <span v-else class="bg-red-100 text-red-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full">Tidak Tersedia</span>
            </td>
            <td class="py-2 px-0">
              <button type="button" v-on:click="getDetailMenu(menu.id)" class="bg-cyan-400 px-4 py-2 rounded-lg font-medium hover:bg-cyan-300 active:bg-cyan-500 transition duration-150 me-2">Detail</button>
              <NuxtLink v-bind:to="`/menus/edit-${menu.id}`" class="bg-yellow-300 px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 active:bg-yellow-500 me-2 transition duration-150">Ubah</NuxtLink>
              <button type="button" class="bg-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-500 active:bg-red-700 transition duration-150" v-on:click="deleteMenu(menu.id, menu.name)">Hapus</button>
            </td>
          </tr>
          <tr v-show="menus.data.length === 0" class="bg-white border-b hover:bg-gray-100">
            <th scope="row" colspan="7" class="px-6 py-4 font-medium whitespace-nowrap text-center">Tidak ada data.</th>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalComponent id="modal" title="Detail Menu" v-bind:modal="modal">
      <div v-if="isModalLoading" class="p-8 text-center">
        <div role="status" class="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center">
          <div class="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
            <svg class="w-12 h-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" fill="currentColor" viewBox="0 0 640 512"><path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z"/></svg>
          </div>
          <div class="w-full">
            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
          </div>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else class="p-8">
        <div class="space-y-8 md:space-y-0 md:space-x-8 md:flex md:items-center">
          <div class="flex items-center justify-center w-full h-48 rounded sm:w-96">
            <img v-bind:src="detailMenu.image" alt="{{ detailMenu.name }}" class="ring-2 ring-slate-600">
          </div>
          <div class="w-full">
            <ul class="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
              <li class="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg flex justify-between">
                <span>Nama:</span>
                <span>{{ detailMenu.name }}</span>
              </li>
              <li class="w-full px-4 py-2 border-b border-gray-200 flex justify-between">
                <span>Kategori:</span>
                <span v-if="detailMenu.category">{{ detailMenu.category.name }}</span>
              </li>
              <li class="w-full px-4 py-2 border-b border-gray-200 flex justify-between">
                <span>Harga:</span>
                <span>Rp{{ formatNumber(detailMenu.price) }}</span>
              </li>
              <li class="w-full px-4 py-2 border-b border-gray-200 flex justify-between">
                <span>Status:</span>
                <span v-if="detailMenu.status" class="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 dark:bg-green-900 dark:text-green-300 rounded-full">Tersedia</span>
                <span v-else class="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 dark:bg-red-900 dark:text-red-300 rounded-full">Tidak Tersedia</span>
              </li>
              <li class="w-full px-4 py-2 border-b border-gray-200 flex justify-between">
                <span>Ditambahkan pada:</span>
                <span>{{ formatDate(detailMenu.created_at) }}</span>
              </li>
              <li class="w-full px-4 py-2 rounded-b-lg flex justify-between">
                <span>Diperbarui pada:</span>
                <span>{{ formatDate(detailMenu.updated_at) }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ModalComponent>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Modal } from 'flowbite'
import moment from 'moment'
import { refreshNuxtData } from "#app"

useHead({
  title: 'Data Menu'
})

const apiRoute = useRuntimeConfig().public.apiBase
const { $swal } = useNuxtApp()
const isModalLoading = ref(false)
const detailMenu = ref({})
let $modalElement, modal

onMounted(() => {
  // setup modal
  $modalElement = document.querySelector('#modal')
  const modalOptions = {
    backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    closable: false,
    onHide: () => {
      detailMenu.value = {}
    },
  }
  if ($modalElement) {
    modal = new Modal($modalElement, modalOptions)
  }
})

// Fetch data from API
const { pending, data: menus } = await useLazyFetch(`${apiRoute}/menus`, {
  key: 'menus',
  headers: {
    Accept: 'application/json'
  }
})

const getDetailMenu = async (id) => {
  isModalLoading.value = true
  modal.show()
  try {
    const { data } = await $fetch(`${apiRoute}/menus/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
    detailMenu.value = data
  } catch (error) {
    modal.hide()
    $swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Data menu gagal diambil.',
      footer: `<p>${error.data.message}</p>`
    })
  }
  isModalLoading.value = false
}

const deleteMenu = (id, name) => {
  $swal.fire({
    title: `Yakin menghapus ${name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await $fetch(`${apiRoute}/menus/${id}`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
          }
        })
        $swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data menu dihapus.',
        })
        await refreshNuxtData('menus')
      } catch (error) {
        $swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Data menu gagal dihapus.',
          footer: `<p>${error.data.message}</p>`
        })
      }
    }
  })
}

const formatDate = (date) => {
  return moment(date).format('DD MMMM YYYY hh:mm:ss')
}

const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number)
}
</script>