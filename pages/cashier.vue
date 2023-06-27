<template>
  <div class="flex">
    <!-- List Meny   -->
    <div class="w-2/3 p-6">
      <Spinner v-if="isLoading" />
      <div v-else>
        <div class="flex items-center space-x-4">
          <p class="font-bold">Kategori</p>
          <div v-if="categories.length !== 0" v-for="category in categories" v-bind:key="category.id">
            <input type="checkbox" v-bind:id="category.name" class="peer hidden" />
            <label v-bind:for="category.name" class="select-none cursor-pointer rounded-full border-2 border-gray-200 px-3 py-1 peer-checked:bg-gray-200 peer-checked:text-gray-900 peer-checked:border-gray-200 ">{{ category.name }}</label>
          </div>
          <div v-else>
            <p class="font-bold text-center text-gray-500">Tidak ada data kategori.</p>
          </div>
        </div>
        <div v-if="menus.length !== 0" class="grid grid-cols-4 gap-12 mt-8">
          <div v-for="(menu, index) in menus" v-bind:key="index" class="block w-full p-4 bg-white border border-gray-200 rounded-lg shadow inline-block hover:shadow-lg transition" v-bind:class="{ 'cursor-pointer': menu.status, 'cursor-not-allowed': !menu.status }" v-on:click="menu.status ? addItem(menu.id) : {}">
            <img class="w-full" v-bind:class="{ grayscale: !menu.status }" v-bind:src="menu.image" v-bind:alt="menu.name" />
            <div>
              <h5 class="font-semibold tracking-tight text-gray-900">{{ menu.name }}</h5>
              <p class="text-sm font-medium text-gray-500 mt-2">Rp{{ formatNumber(menu.price) }}</p>
              <p class="text-xs font-medium mt-2">
                <span class="bg-gray-100 text-gray-800 font-medium px-2.5 py-0.5 rounded">{{ menu.category.name }}</span>
              </p>
              <p class="text-xs font-medium mt-6">
                <span v-if="menu.status" class="bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">Tersedia</span>
                <span v-else class="bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full">Tidak Tersedia</span>
              </p>
            </div>
          </div>
        </div>
        <div v-else class="mt-8">
          <p class="font-bold text-center text-xl text-gray-500">Tidak ada data menu.</p>
        </div>
      </div>
    </div>

    <!--  Cart  -->
    <div class="w-1/3 bg-gray-100 p-6">
      <div class="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow mx-auto">
        <div class="flex items-center justify-between mb-4">
          <h5 class="text-xl font-bold leading-none text-gray-900">Keranjang Pelanggan</h5>
          <button type="button" class="text-sm font-medium text-red-600 hover:underline disabled:text-red-400 disabled:no-underline" v-bind:class="(cart.length === 0) ? 'disabled' : ''" v-bind:disabled="cart.length === 0" v-on:click="deleteAll()">Hapus Semua</button>
        </div>
        <div class="flow-root">
          <ul role="list" class="divide-y divide-gray-300">
            <li class="py-3 sm:py-4">
              <div class="flex items-center align-top space-x-4">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-400 truncate">Menu</p>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-400 truncate">Jumlah</p>
                </div>
                <div class="inline-flex items-center text-sm font-medium text-gray-400">Subtotal</div>
              </div>
            </li>
            <li class="py-3 sm:py-4" v-for="(item, index) in cart" :key="index">
              <div class="flex items-center space-x-4">
                <div class="flex-1 min-w-0">
                  <span class="text-red-500 font-medium text-sm cursor-pointer hover:text-red-600 hover:underline" v-on:click="deleteItem(index)">Hapus</span>
                  <div>
                    <p class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</p>
                    <p class="text-sm text-gray-500 truncate">Rp{{ formatNumber(item.price) }}</p>
                  </div>
                </div>
                <div class="flex-1">
                  <span class="text-2xl me-3 cursor-pointer text-gray-400 hover:text-gray-900" v-on:click="changeQuantity('subtract', item)">-</span>
                  <span>{{ item.amount }}</span>
                  <span class="text-2xl ms-3 cursor-pointer text-gray-400 hover:text-gray-900" v-on:click="changeQuantity('add', item)">+</span>
                </div>
                <div class="inline-flex items-center text-base font-semibold text-gray-900">Rp{{ formatNumber(item.price * item.amount) }}</div>
              </div>
            </li>
            <li class="py-3 sm:py-4" v-show="cart.length === 0">
              <div class="text-center">
                <p class="text-gray-400 text-sm">Keranjang kosong.</p>
              </div>
            </li>
          </ul>
        </div>
        <div class="text-right mt-8">
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-blue-400 disabled:cursor-not-allowed" v-bind:class="(cart.length === 0) ? 'disabled' : ''" v-bind:disabled="cart.length === 0" v-on:click="modal.show()">Submit</button>
        </div>
      </div>
    </div>

    <!--  Preview/Confirm Modal  -->
    <ModalComponent id="modalDetail" title="Konfirmasi Pesanan" v-bind:modal="modal">
      <Spinner v-if="isModalLoading" class="px-6 py-4 text-center" />
      <div v-else class="px-6 py-4">
        <div class="flex justify-between mb-2">
          <span class="text-xl text-gray-500">Admin</span>
          <span class="text-xl">{{ transaction.admin }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-xl text-gray-500">Tanggal</span>
          <span class="text-xl">{{ formatDate(transaction.date) }}</span>
        </div>
        <ul role="list" class="divide-y divide-gray-300 mb-6">
          <li class="py-3 sm:py-4">
            <div class="flex items-center align-top space-x-4">
              <div class="flex-initial w-1/4">
                <p class="text-sm font-medium text-gray-400">Menu</p>
              </div>
              <div class="flex-initial w-1/4">
                <p class="text-sm font-medium text-gray-400 text-right">Harga</p>
              </div>
              <div class="flex-initial w-1/4">
                <p class="text-sm font-medium text-gray-400 text-center">Jumlah</p>
              </div>
              <div class="flex-initial w-1/4">
                <p class="text-sm font-medium text-gray-400 text-right">Total</p>
              </div>
            </div>
          </li>
          <li class="py-3 sm:py-4" v-for="(item, index) in cart" :key="index">
            <div class="flex items-center justify-between">
              <div class="flex-initial w-1/4">
                <p class="text-sm font-medium text-gray-900">{{ item.name }}</p>
              </div>
              <div class="flex-initial w-1/4">
                <p class="text-sm font-medium text-gray-900 text-right">Rp{{ formatNumber(item.price) }}</p>
              </div>
              <div class="flex-initial w-1/4">
                <p class="text-sm font-medium text-gray-900 text-center">{{ item.amount }}</p>
              </div>
              <div class="flex-initial w-1/4">
                <p class="text-sm font-medium text-gray-900 text-right">Rp{{ formatNumber(item.price * item.amount) }}</p>
              </div>
            </div>
          </li>
        </ul>
        <div class="flex justify-between mb-2">
          <span class="text-xl text-gray-500">Subtotal</span>
          <span class="text-xl">Rp{{ formatNumber(subTotal) }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-xl text-gray-500">PPN</span>
          <span class="text-xl">10%</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-xl text-gray-500">Total Harga</span>
          <span class="text-xl">Rp{{ formatNumber(transaction.totalPrice) }}</span>
        </div>
        <div class="flex justify-between mb-8">
          <span class="text-xl text-gray-500">Pembulatan</span>
          <span class="text-xl font-bold">Rp{{ formatNumber(transaction.roundedTotalPrice) }}</span>
        </div>
        <div>
          <form action="" autocomplete="off" class="flex w-full items-center space-x-8">
            <div class="w-1/3">
              <label for="metode_pembayaran" class="block mb-2 text-xl text-gray-500">Metode Pembayaran</label>
              <select id="metode_pembayaran" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" v-model="transaction.paymentMethod">
                <option disabled value="">Pilih pembayaran</option>
                <option value="Tunai">Tunai</option>
                <option value="QRIS">QRIS</option>
              </select>
            </div>
            <div class="w-2/3" v-show="transaction.paymentMethod === 'Tunai'">
              <label for="tunai" class="block mb-3 text-sm font-medium text-gray-500">Uang Bayar</label>
              <input type="text" id="tunai" v-model="transaction.cash" class="bg-gray-50 border-0 text-gray-900 text-sm rounded-lg ring-1 ring-gray-400 focus:ring-2 focus:ring-slate-500 shadow block w-full p-2.5 outline-none">
            </div>
          </form>
        </div>
        <div class="text-right mt-8">
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 disabled:bg-blue-400 disabled:cursor-not-allowed" v-bind:class="(cart.length === 0) ? 'disabled' : ''" v-bind:disabled="cart.length === 0" v-on:click="submitTransaction()">Submit</button>
        </div>
      </div>
    </ModalComponent>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Modal } from 'flowbite'
import moment from "moment/moment"

useHead({
  title: 'Kasir | POS'
})

const apiRoute = useRuntimeConfig().public.apiBase
const { $swal } = useNuxtApp()
const categories = ref([])
const menus = ref([])
const cart = ref([])
const isLoading = ref(false)
const isModalLoading = ref(false)
const transaction = ref({
  admin: 'Ananta Desta',
  date: new Date(),
  totalPrice: 0,
  roundedTotalPrice: 0,
  paymentMethod: '',
  cash: null
})
const errors = ref({})
let $modalElement, modal

const subTotal = computed(() => {
  return cart.value.reduce((total, item) => total + (item.amount * item.price), 0)
})
transaction.value.totalPrice = computed(() => {
  return subTotal.value + ((subTotal.value * 10) / 100)
})
transaction.value.roundedTotalPrice = computed(() => {
  return (Math.round(transaction.value.totalPrice / 500) * 500)
})

onMounted(() => {
  // setup modal
  $modalElement = document.querySelector('#modalDetail')
  const modalOptions = {
    backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
    closable: false,
    onShow: () => {
    },
    onHide: () => {
    },
  }
  if ($modalElement) {
    modal = new Modal($modalElement, modalOptions)
  }

  // load data
  getCategories()
  getMenus()
})

const getCategories = async () => {
  try {
    const { data } = await $fetch(`${apiRoute}/categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
    categories.value = data
  } catch (error) {
    $swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Data kategori gagal diambil.',
      footer: `<p>${error.data.message}</p>`
    })
  }
}

const getMenus = async() => {
  isLoading.value = true
  try {
    const { data } = await $fetch(`${apiRoute}/menus`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })
    menus.value = data
  } catch (error) {
    $swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Data menu gagal diambil.',
      footer: `<p>${error.data.message}</p>`
    })
  }
  isLoading.value = false
}

const addItem = (id) => {
  let temp = menus.value.find(menu => {
    return menu.id === id
  })
  let data = {...temp}
  let item = cart.value.find(item => {
    return item.id === data.id
  })
  if (item) {
    item.amount += 1
  } else {
    data.amount = 1
    cart.value.push(data)
  }
}

const changeQuantity = (type, item) => {
  if (type === 'subtract' && item.amount > 1) {
    item.amount -= 1
  } else if (type === 'add') {
    item.amount += 1
  }
}

const deleteItem = (index) => {
  cart.value.splice(index, 1)
}

const deleteAll = () => {
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
      cart.value = []
    }
  })
}

const submitTransaction = async () => {
  isModalLoading.value = true
  const items = cart.value.map((item) => {
    return {
      id: item.id,
      amount: item.amount,
      price: item.price,
    }
  })
  try {
    const response = await $fetch(`${apiRoute}/transactions`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: {
        admin: transaction.value.admin,
        total_price: transaction.value.totalPrice,
        rounded_total_price: transaction.value.roundedTotalPrice,
        payment_method: transaction.value.paymentMethod,
        items: items
      }
    })
    $swal.fire({
      icon: 'success',
      title: 'Sukses',
      text: 'Transaksi berhasil.',
    })
    modal.hide()
    cart.value = []
  } catch (error) {
    if (error.data.code === 400) {
      errors.value = error.data.errors
    } else {
      $swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Transaksi gagal.',
        footer: `<p>${error.data.message}</p>`
      })
    }
  }
  isModalLoading.value = false
}

const formatDate = (date) => {
  return moment(date).format('DD MMMM YYYY')
}

const formatNumber = (number) => {
  return new Intl.NumberFormat('id-ID').format(number)
}
</script>