<template>
  <div class="flex">
    <div class="w-2/3 p-6">
      <div class="grid grid-cols-4 gap-12">
        <div v-for="(brg, index) in barang" v-bind:key="index" class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow inline-block cursor-pointer hover:shadow-lg transition" v-on:click="tambahKeranjang(brg.id)">
          <img class="w-full" v-bind:src="`http://localhost:8000/storage/images/` + brg.gambar" alt="{{ brg.nama }}" />
          <div>
            <h5 class="font-semibold tracking-tight text-gray-900">{{ brg.nama }}</h5>
            <p class="text-sm font-medium">{{ brg.harga }}</p>
            <p class="text-sm font-medium">Stok {{ brg.stok }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/3 bg-gray-100 p-6">
      <div class="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
        <div class="flex items-center justify-between mb-4">
          <h5 class="text-xl font-bold leading-none text-gray-900">Keranjang Pelanggan</h5>
          <button type="button" class="text-sm font-medium text-red-600 hover:underline" v-on:click="hapusSemua">Hapus Semua</button>
        </div>
        <div class="flow-root">
          <ul role="list" class="divide-y divide-gray-300">
            <li class="py-3 sm:py-4">
              <div class="flex items-center align-top space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-400 truncate">Barang</p>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-400 truncate">Jumlah</p>
                </div>
                <div class="inline-flex items-center text-sm font-medium text-gray-400">Subtotal</div>
              </div>
            </li>
            <li class="py-3 sm:py-4" v-for="(krjg, index) in keranjang" :key="index">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <span class="text-red-500 font-medium text-sm cursor-pointer hover:text-red-600 hover:underline">Hapus</span>
                  <div>
                    <p class="text-sm font-medium text-gray-900 truncate">{{ krjg.nama }}</p>
                    <p class="text-sm text-gray-500 truncate">{{ krjg.harga }}</p>
                  </div>
                </div>
                <div class="flex-1">
                  <span class="text-2xl me-3 cursor-pointer text-gray-400 hover:text-gray-900">-</span>
                  <span>{{ krjg.banyak }}</span>
                  <span class="text-2xl ms-3 cursor-pointer text-gray-400 hover:text-gray-900">+</span>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900">{{ krjg.banyak * krjg.harga }}</div>
              </div>
            </li>
            <li class="py-3 sm:py-4" v-show="keranjang.length === 0">
              <div class="text-center">
                <p class="text-gray-400 text-sm">Keranjang kosong.</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="text-right mt-8">
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-blue-400 disabled:cursor-not-allowed" v-bind:class="(keranjang.length === 0) ? 'disabled' : ''" v-bind:disabled="keranjang.length === 0">Submit</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const config = useRuntimeConfig()
const { $swal } = useNuxtApp()
const barang = ref([])
const keranjang = ref([])
const isLoading = ref(false)
let temp = null

onMounted(() => {
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

function tambahKeranjang(id) {
  temp = barang.value
  temp.banyak = 1
  console.log(temp)
  keranjang.value.push(temp)
  temp = null
}

function hapusSemua() {
  $swal.fire({
    title: `Yakin kosongkan keranjang?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal'
  }).then((result) => {
    if (result.isConfirmed) {
      keranjang.value = []
    }
  })
}
</script>