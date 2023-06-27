<template>
  <div class="container mx-auto xl:px-20 my-8">
    <h1 class="text-4xl font-bold text-center">Tambah Menu</h1>
    <div class="mt-8 w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-lg mx-auto">
      <div v-if="isLoading || pending" class="text-center">
        <Spinner />
      </div>
      <div v-else>
        <form class="space-y-7" autocomplete="off" v-on:submit.prevent="addMenu()">
          <div>
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Nama</label>
            <input type="text" id="name" v-model="menu.name" class="bg-gray-50 border-0 text-gray-900 text-sm rounded-lg ring-1 ring-gray-400 focus:ring-2 focus:ring-slate-500 shadow block w-full p-2.5 outline-none">
            <span class="text-red-500" v-if="errors.name">{{ errors.name[0] }}</span>
          </div>
          <div>
            <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kategori</label>
            <select id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" v-model="menu.category_id">
              <option disabled value="">Pilih kategori</option>
              <option v-for="category in categories.data" v-bind:key="category.id" v-bind:value="category.id">{{ category.name }}</option>
            </select>
            <span class="text-red-500" v-if="errors.category_id">{{ errors.category_id[0] }}</span>
          </div>
          <div>
            <label for="price" class="block mb-2 text-sm font-medium text-gray-900">Harga</label>
            <input type="number" id="price" v-model="menu.price" class="bg-gray-50 border-0 text-gray-900 text-sm rounded-lg ring-1 ring-gray-400 focus:ring-2 focus:ring-slate-500 shadow block w-full p-2.5 outline-none">
            <span class="text-red-500" v-if="errors.price">{{ errors.price[0] }}</span>
          </div>
          <div>
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="image">Gambar</label>
            <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none" id="image" type="file" v-on:change="handleFile($event)" accept="image/png, image/jpg, image/jpeg">
            <span class="text-red-500" v-if="errors.image">{{ errors.image[0] }}</span>
          </div>
          <div class="flex justify-between">
            <NuxtLink to="/menus" class="bg-slate-800 px-5 py-2.5 rounded-lg text-white hover:bg-slate-700 transition duration-150">Kembali</NuxtLink>
            <button type="submit" class="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg px-5 py-2.5">Tambah</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Tambah Data Menu'
})

const apiRoute = useRuntimeConfig().public.apiBase
const { $swal } = useNuxtApp()
const menu = ref({
  name: '',
  category_id: '',
  price: '',
  image: ''
})
const isLoading = ref(false)
const errors = ref({})

// Fetch data from API
const { pending, data: categories } = await useLazyFetch(`${apiRoute}/categories`, {
  key: 'categories',
  headers: {
    Accept: 'application/json'
  }
})

const addMenu = async () => {
  isLoading.value = true
  try {
    let formData = new FormData()
    formData.append('name', menu.value.name)
    formData.append('category_id', menu.value.category_id)
    formData.append('price', menu.value.price)
    formData.append('image', menu.value.image)

    await $fetch(`${apiRoute}/menus`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: formData
    })
    $swal.fire({
      icon: 'success',
      title: 'Sukses',
      text: 'Data menu berhasil ditambahkan.',
    })
    resetForm()
  } catch (error) {
    if (error.data.code === 400) {
      errors.value = error.data.errors
      console.log(error.data)
    } else {
      $swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Data menu gagal ditambahkan.',
        footer: `<p>${error.data.message}</p>`
      })
    }
  }
  isLoading.value = false
}

const handleFile = (event) => {
  menu.value.image = event.target.files[0]
}

const resetForm = () => {
  menu.value.name = ''
  menu.value.category_id = ''
  menu.value.price = ''
  menu.value.image = ''
  errors.value = {}
}
</script>