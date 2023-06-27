<template>
  <div class="container mx-auto xl:px-20 my-8">
    <div class="flex justify-between">
      <h1 class="text-4xl font-bold">Data Kategori Menu</h1>
      <button type="button" class="flex-none bg-blue-700 px-4 py-2 rounded-lg text-white hover:bg-blue-800 transition duration-150" v-on:click="showModal('Tambah Kategori')">Tambah</button>
    </div>
    <div class="mt-8">
      <Spinner v-if="pending" />
      <table v-else class="w-full text-center table-auto shadow-md">
        <thead class="bg-slate-700 text-white">
          <tr>
            <th scope="col" class="py-2">ID</th>
            <th scope="col" class="py-2">Nama</th>
            <th scope="col" class="py-2 w-1/5">Dibuat pada</th>
            <th scope="col" class="py-2 w-1/5">Diperbarui pada</th>
            <th scope="col" class="py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories.data" class="bg-white border-b hover:bg-gray-100">
            <th scope="row" class="font-medium whitespace-nowrap">{{ category.id }}</th>
            <td class="py-2">{{ category.name }}</td>
            <td class="py-2">{{ formatDate(category.created_at) }}</td>
            <td class="py-2">{{ formatDate(category.updated_at) }}</td>
            <td class="py-2">
              <button type="button" class="px-3 py-2 text-sm bg-red-600 rounded-lg font-medium hover:bg-red-500 active:bg-red-700 transition duration-150" v-on:click="deleteCategory(category.id, category.name)">Hapus</button>
            </td>
          </tr>
          <tr v-show="categories.data.length === 0" class="bg-white border-b hover:bg-gray-100">
            <th scope="row" colspan="7" class="px-6 py-4 font-medium whitespace-nowrap text-center">Tidak ada data.</th>
          </tr>
        </tbody>
      </table>
    </div>
    <ModalComponent id="modal" v-bind:title="modalTitle" v-bind:modal="modal">
      <div v-if="isModalLoading" class="p-8 text-center">
        <Spinner />
      </div>
      <div v-else class="p-6">
        <form action="" autocomplete="off" v-on:submit.prevent="addCategory()">
          <div>
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Kategori</label>
            <input type="text" id="name" v-model="categoryName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required>
            <span class="text-red-500" v-if="errors.name">{{ errors.name[0] }}</span>
          </div>
          <button type="submit" class="flex-none bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600 transition duration-150 mt-6">Submit</button>
        </form>
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
  title: 'Data Kategori'
})

const apiRoute = useRuntimeConfig().public.apiBase
const { $swal } = useNuxtApp()
const modalTitle = ref('')
const isModalLoading = ref(false)
const categoryName = ref('')
const errors = ref({})
let $modalElement, modal

onMounted(() => {
  // setup modal
  $modalElement = document.querySelector('#modal')
  const modalOptions = {
    backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    closable: false,
    onHide: () => {
      modalTitle.value = ''
      categoryName.value = ''
      errors.value = {}
    },
  }
  if ($modalElement) {
    modal = new Modal($modalElement, modalOptions)
  }
})

// Fetch data from API
const { pending, data: categories } = await useLazyFetch(`${apiRoute}/categories`, {
  key: 'categories',
  headers: {
    Accept: 'application/json'
  }
})

const showModal = (title) => {
  modalTitle.value = title
  modal.show()
  document.querySelector('#name').focus()
}

const addCategory = async () => {
  try {
    isModalLoading.value = true
    await $fetch(`${apiRoute}/categories`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: { name: categoryName.value }
    })
    $swal.fire({
      icon: 'success',
      title: 'Sukses',
      text: 'Data kategori ditambah.',
    })
    categoryName.value = ''
    errors.value = {}
    isModalLoading.value = false
    await refreshNuxtData('categories')
  } catch (error) {
    isModalLoading.value = false
    if (error.data.code === 400) {
      errors.value = error.data.errors
    } else {
      $swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Data kategori gagal dihapus.',
        footer: `<p>${error.data.message}</p>`
      })
    }
  }
}

const deleteCategory = (id, name) => {
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
        await $fetch(`${apiRoute}/categories/${id}`, {
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
          }
        })
        $swal.fire({
          icon: 'success',
          title: 'Sukses',
          text: 'Data kategori dihapus.',
        })
        await refreshNuxtData('categories')
      } catch (error) {
        $swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Data kategori gagal dihapus.',
          footer: `<p>${error.data.message}</p>`
        })
      }
    }
  })
}

const formatDate = (date) => {
  return moment(date).format('DD MMMM YYYY hh:mm:ss')
}
</script>