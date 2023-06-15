<template>
  <div class="container mx-auto xl:px-20 my-8">
    <div class="flex justify-between">
      <h1 class="text-4xl font-bold">Data Barang</h1>
      <NuxtLink to="/barang/create"
            class="flex-none bg-blue-700 px-4 py-2 rounded-lg text-white hover:bg-blue-800 transition duration-150">Tambah</NuxtLink>
    </div>
    <div class="mt-8">
      <Spinner v-if="isLoading" />
      <table v-else class="w-full text-center table-auto shadow-md">
        <thead class="bg-slate-700 text-white">
          <tr>
            <th scope="col" class="px-6 py-3">ID</th>
            <th scope="col" class="px-6 py-3">Gambar</th>
            <th scope="col" class="px-6 py-3">Nama</th>
            <th scope="col" class="px-6 py-3">Jenis</th>
            <th scope="col" class="px-6 py-3">Stok</th>
            <th scope="col" class="px-6 py-3">Harga</th>
            <th scope="col" class="px-6 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="brg in barang" v-bind:key="brg.id" class="bg-white border-b hover:bg-gray-100">
            <th scope="row" class=" font-medium whitespace-nowrap">{{ brg.id }}</th>
            <td class=""><img v-bind:src="`http://localhost:8000/storage/images/` + brg.gambar" alt="{{ brg.nama }}" class="w-20 mx-auto"></td>
            <td class="">{{ brg.nama }}</td>
            <td class="">{{ brg.jenis }}</td>
            <td class="">{{ brg.stok }}</td>
            <td class="">{{ brg.harga }}</td>
            <td class="">
              <button type="button" id="modalButton" class="bg-cyan-400 px-4 py-2 rounded-lg font-medium hover:bg-cyan-300 active:bg-cyan-500 transition duration-150 me-2" v-on:click="getDetailBarang(brg.id)">Detail</button>
              <NuxtLink v-bind:to="`/barang/edit-${brg.id}`"
                  class="bg-yellow-300 px-4 py-2 rounded-lg font-medium hover:bg-yellow-400 active:bg-yellow-500 me-2 transition duration-150">Ubah</NuxtLink>
              <button type="button"
                  class="bg-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-500 active:bg-red-700 transition duration-150" v-on:click="deleteBarang(brg.id, brg.nama)">Hapus</button>
            </td>
          </tr>
          <tr v-show="barang.length === 0" class="bg-white border-b hover:bg-gray-100">
            <th scope="row" colspan="7" class="px-6 py-4 font-medium whitespace-nowrap text-center">Tidak ada data.</th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <ModalDetail id="modalDetail" title="Detail" v-bind:modal="modal">
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
          <img v-bind:src="`http://localhost:8000/storage/images/` + detailBarang.gambar" alt="" class="ring-2 ring-slate-600">
        </div>
        <div class="w-full">
          <ul class="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
            <li class="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg flex justify-between">
              <span>Barcode:</span>
              <span>{{ detailBarang.barcode }}</span>
            </li>
            <li class="w-full px-4 py-2 border-b border-gray-200 flex justify-between">
              <span>Nama:</span>
              <span>{{ detailBarang.nama }}</span>
            </li>
            <li class="w-full px-4 py-2 border-b border-gray-200 flex justify-between">
              <span>Harga:</span>
              <span>{{ detailBarang.harga }}</span>
            </li>
            <li class="w-full px-4 py-2 border-b border-gray-200 flex justify-between">
              <span>Stok:</span>
              <span>{{ detailBarang.stok }}</span>
            </li>
            <li class="w-full px-4 py-2 border-b border-gray-200 flex justify-between">
              <span>Jenis:</span>
              <span>{{ detailBarang.jenis }}</span>
            </li>
            <li class="w-full px-4 py-2 border-b border-gray-200 flex justify-between">
              <span>Ditambahkan pada:</span>
              <span>{{ detailBarang.created_at }}</span>
            </li>
            <li class="w-full px-4 py-2 rounded-b-lg flex justify-between">
              <span>Diperbarui pada:</span>
              <span>{{ detailBarang.updated_at }}</span>
            </li>
          </ul>
        </div>
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </ModalDetail>
</template>

<script setup>
import { onMounted } from 'vue'
import { Modal } from 'flowbite'

useHead({
  title: 'Data Barang'
})

const config = useRuntimeConfig()
const { $swal } = useNuxtApp()
const barang = ref([])
const detailBarang = ref({})
const isLoading = ref(false)
const isModalLoading = ref(false)
let $modalElement, modal

onMounted(() => {
  // setup modal
  $modalElement = document.querySelector('#modalDetail')
  const modalOptions = {
    backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    closable: false,
    onHide: () => {
      detailBarang.value = {}
    },
  }
  if ($modalElement) {
    modal = new Modal($modalElement, modalOptions)
  }

  // load data
  getBarang()
})

async function getBarang() {
  isLoading.value = true
  try {
    const response = await $fetch(`${config.public.apiBase}/api/barang`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
    console.log(response)
    barang.value = response.data
  } catch (error) {
    console.log(error)
    console.log(error.data)
    $swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: 'Data barang gagal diambil.',
      footer: `<p>${error.data}</p>`
    })
  }
  isLoading.value = false
}

async function getDetailBarang(id) {
  isModalLoading.value = true
  modal.show()
  try {
    const response = await $fetch(`${config.public.apiBase}/api/barang/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
    console.log(response)
    detailBarang.value = response.data
  } catch (error) {
    console.log(error)
    console.log(error.data)
  }
  isModalLoading.value = false
}

function deleteBarang(id, nama) {
  $swal.fire({
    title: `Yakin menghapus ${nama}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await $fetch(`${config.public.apiBase}/api/barang/${id}`, {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
          }
        })
        console.log(response)
        $swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data barang dihapus.',
        })
        getBarang()
      } catch (error) {
        console.log(error)
        console.log(error.data)
        $swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Data barang gagal dihapus.',
          footer: `<p>${error.data}</p>`
        })
      }
    }
  })
}
</script>