/* =====================================================
   CertiCode Rental Dashboard - Firebase Module
   ===================================================== */

// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    getDocs,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// =====================================================
// FIREBASE CONFIGURATION
// =====================================================
const firebaseConfig = {
    apiKey: "AIzaSyAJJwpEpsFGgMVIIhsIwWWew0l4H2owAE8",
    authDomain: "certicode-eb81f.firebaseapp.com",
    projectId: "certicode-eb81f",
    storageBucket: "certicode-eb81f.firebasestorage.app",
    messagingSenderId: "314128261163",
    appId: "1:314128261163:web:1c49ea4c01a144656b0a6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Update Firebase status
const firebaseStatus = document.getElementById('firebase-status');
if (firebaseStatus) {
    firebaseStatus.textContent = 'Connected';
    firebaseStatus.style.color = '#10B981';
}

// =====================================================
// GLOBAL DATA STORES
// =====================================================
let usersData = {};
let rentalsData = {};
let rentalItemsData = {};
let categoriesData = {};
let rentalDetailsData = {};
let deliveriesData = {};
let paymentsData = {};

// =====================================================
// DOM ELEMENTS
// =====================================================
const authSection = document.getElementById('auth-section');
const appContainer = document.getElementById('app-container');
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');

// =====================================================
// AUTHENTICATION FUNCTIONS
// =====================================================
async function registerUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const userData = {
            id: user.uid,
            full_name: email.split('@')[0],
            email: email,
            role: "customer",
            is_active: true,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        };
        
        await addDoc(collection(db, "users"), userData);
        window.AppUtils.showAuthMessage('Registration successful! You can now login.', 'success');
        return user;
    } catch (error) {
        window.AppUtils.showAuthMessage(`Registration error: ${error.message}`, 'error');
        console.error("Registration error:", error);
        return null;
    }
}

async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        window.AppUtils.showAuthMessage('Login successful!', 'success');
        return userCredential.user;
    } catch (error) {
        window.AppUtils.showAuthMessage(`Login error: ${error.message}`, 'error');
        console.error("Login error:", error);
        return null;
    }
}

async function logoutUser() {
    try {
        await signOut(auth);
        return true;
    } catch (error) {
        console.error("Logout error:", error);
        return false;
    }
}

// =====================================================
// DROPDOWN POPULATION
// =====================================================
async function populateUserDropdown() {
    const userSelect = document.getElementById('user-id-select');
    const detailRentalSelect = document.getElementById('detail-rental-id');
    const deliveryRentalSelect = document.getElementById('delivery-rental-id');
    const paymentRentalSelect = document.getElementById('payment-rental-id');
    
    [userSelect, detailRentalSelect, deliveryRentalSelect, paymentRentalSelect].forEach(select => {
        if (select) {
            while (select.options.length > 1) {
                select.remove(1);
            }
        }
    });
    
    Object.values(usersData).forEach(user => {
        if (user.is_active) {
            const option = document.createElement('option');
            option.value = user.docId;
            option.textContent = `${user.full_name} (${user.email})`;
            if (userSelect) userSelect.appendChild(option.cloneNode(true));
        }
    });
    
    Object.values(rentalsData).forEach(rental => {
        const user = usersData[rental.user_id];
        const userName = user ? user.full_name : 'Unknown User';
        
        const option = document.createElement('option');
        option.value = rental.docId;
        option.textContent = `Rental: ${rental.docId.substring(0, 8)}... - ${userName}`;
        
        if (detailRentalSelect) detailRentalSelect.appendChild(option.cloneNode(true));
        if (deliveryRentalSelect) deliveryRentalSelect.appendChild(option.cloneNode(true));
        if (paymentRentalSelect) paymentRentalSelect.appendChild(option.cloneNode(true));
    });
}

async function populateCategoryDropdown() {
    const categorySelect = document.getElementById('category-id-select');
    const itemSelect = document.getElementById('detail-item-id');
    
    [categorySelect, itemSelect].forEach(select => {
        if (select) {
            while (select.options.length > 1) {
                select.remove(1);
            }
        }
    });
    
    Object.values(categoriesData).forEach(category => {
        const option = document.createElement('option');
        option.value = category.docId;
        option.textContent = category.category_name;
        if (categorySelect) categorySelect.appendChild(option.cloneNode(true));
    });
    
    Object.values(rentalItemsData).forEach(item => {
        const option = document.createElement('option');
        option.value = item.docId;
        option.textContent = item.item_name;
        if (itemSelect) itemSelect.appendChild(option.cloneNode(true));
    });
}

// =====================================================
// CRUD - USERS
// =====================================================
async function loadUsers() {
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        usersData = {};
        const usersList = document.getElementById('users-list');
        if (usersList) usersList.innerHTML = '';
        
        querySnapshot.forEach((docSnap) => {
            const user = { docId: docSnap.id, ...docSnap.data() };
            usersData[docSnap.id] = user;
            
            if (usersList) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.id || docSnap.id.substring(0, 8)}...</td>
                    <td>${user.full_name || 'N/A'}</td>
                    <td>${user.email || 'N/A'}</td>
                    <td>${user.role || 'N/A'}</td>
                    <td><span class="status-badge ${user.is_active ? 'status-available' : 'status-cancelled'}">${user.is_active ? 'Active' : 'Inactive'}</span></td>
                    <td>${user.created_at ? new Date(user.created_at.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                    <td class="table-actions">
                        <button class="action-btn edit-btn" onclick="editUser('${docSnap.id}')">Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteUser('${docSnap.id}')">Delete</button>
                    </td>
                `;
                usersList.appendChild(row);
            }
        });
        
        await populateUserDropdown();
    } catch (error) {
        console.error("Error loading users:", error);
    }
}

window.editUser = async function(docId) {
    const user = usersData[docId];
    if (!user) return;
    
    document.getElementById('user-id').value = docId;
    document.getElementById('full-name').value = user.full_name || '';
    document.getElementById('user-email').value = user.email || '';
    document.getElementById('role').value = user.role || 'customer';
    document.getElementById('is-active').value = user.is_active ? 'true' : 'false';
    
    document.getElementById('users-form').scrollIntoView({ behavior: 'smooth' });
};

window.deleteUser = async function(docId) {
    if (confirm('Are you sure you want to delete this user?')) {
        try {
            await deleteDoc(doc(db, "users", docId));
            await loadUsers();
        } catch (error) {
            alert('Error deleting user: ' + error.message);
        }
    }
};

document.getElementById('save-user')?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const docId = document.getElementById('user-id').value;
    const fullName = document.getElementById('full-name').value;
    const userEmail = document.getElementById('user-email').value;
    const role = document.getElementById('role').value;
    const isActive = document.getElementById('is-active').value === 'true';
    
    try {
        const userData = {
            full_name: fullName,
            email: userEmail,
            role: role,
            is_active: isActive,
            updated_at: serverTimestamp()
        };
        
        if (docId) {
            await updateDoc(doc(db, "users", docId), userData);
        } else {
            userData.created_at = serverTimestamp();
            await addDoc(collection(db, "users"), userData);
        }
        
        document.getElementById('users-form').reset();
        document.getElementById('user-id').value = '';
        await loadUsers();
    } catch (error) {
        alert('Error saving user: ' + error.message);
    }
});

// =====================================================
// CRUD - RENTALS
// =====================================================
async function loadRentals() {
    try {
        const querySnapshot = await getDocs(collection(db, "rentals"));
        rentalsData = {};
        const rentalsList = document.getElementById('rentals-list');
        if (rentalsList) rentalsList.innerHTML = '';
        
        querySnapshot.forEach((docSnap) => {
            const rental = { docId: docSnap.id, ...docSnap.data() };
            rentalsData[docSnap.id] = rental;
            
            if (rentalsList) {
                const user = usersData[rental.user_id];
                const userName = user ? user.full_name : 'Unknown';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${rental.id || docSnap.id.substring(0, 8)}...</td>
                    <td>${userName}</td>
                    <td>${rental.rental_date || 'N/A'}</td>
                    <td>${rental.total_hours || 'N/A'}</td>
                    <td>${rental.total_price ? '₱' + rental.total_price.toFixed(2) : 'N/A'}</td>
                    <td><span class="status-badge status-${rental.status || 'pending'}">${rental.status || 'Pending'}</span></td>
                    <td>${rental.created_at ? new Date(rental.created_at.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                    <td class="table-actions">
                        <button class="action-btn edit-btn" onclick="editRental('${docSnap.id}')">Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteRental('${docSnap.id}')">Delete</button>
                    </td>
                `;
                rentalsList.appendChild(row);
            }
        });
        
        await populateUserDropdown();
    } catch (error) {
        console.error("Error loading rentals:", error);
    }
}

window.editRental = async function(docId) {
    const rental = rentalsData[docId];
    if (!rental) return;
    
    document.getElementById('rental-id').value = docId;
    document.getElementById('user-id-select').value = rental.user_id || '';
    document.getElementById('rental-date').value = rental.rental_date || '';
    document.getElementById('start-time').value = rental.start_time || '';
    document.getElementById('total-hours').value = rental.total_hours || 1;
    document.getElementById('delivery-fee').value = rental.delivery_fee || 0;
    document.getElementById('total-price').value = rental.total_price || 0;
    document.getElementById('rental-status').value = rental.status || 'pending';
    
    document.getElementById('rentals-form').scrollIntoView({ behavior: 'smooth' });
};

window.deleteRental = async function(docId) {
    if (confirm('Are you sure you want to delete this rental?')) {
        try {
            await deleteDoc(doc(db, "rentals", docId));
            await loadRentals();
        } catch (error) {
            alert('Error deleting rental: ' + error.message);
        }
    }
};

document.getElementById('save-rental')?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const docId = document.getElementById('rental-id').value;
    const userId = document.getElementById('user-id-select').value;
    const rentalDate = document.getElementById('rental-date').value;
    const startTime = document.getElementById('start-time').value;
    const totalHours = parseInt(document.getElementById('total-hours').value);
    const deliveryFee = parseFloat(document.getElementById('delivery-fee').value);
    const totalPrice = parseFloat(document.getElementById('total-price').value);
    const status = document.getElementById('rental-status').value;
    
    try {
        const rentalData = {
            user_id: userId,
            rental_date: rentalDate,
            start_time: startTime,
            total_hours: totalHours,
            delivery_fee: deliveryFee,
            total_price: totalPrice,
            status: status
        };
        
        if (docId) {
            await updateDoc(doc(db, "rentals", docId), rentalData);
        } else {
            rentalData.created_at = serverTimestamp();
            await addDoc(collection(db, "rentals"), rentalData);
        }
        
        document.getElementById('rentals-form').reset();
        document.getElementById('rental-id').value = '';
        window.AppUtils.setDefaultDates();
        await loadRentals();
    } catch (error) {
        alert('Error saving rental: ' + error.message);
    }
});

// =====================================================
// CRUD - CATEGORIES
// =====================================================
async function loadCategories() {
    try {
        const querySnapshot = await getDocs(collection(db, "item_categories"));
        categoriesData = {};
        const categoriesList = document.getElementById('categories-list');
        if (categoriesList) categoriesList.innerHTML = '';
        
        querySnapshot.forEach((docSnap) => {
            const category = { docId: docSnap.id, ...docSnap.data() };
            categoriesData[docSnap.id] = category;
            
            if (categoriesList) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${category.id || docSnap.id.substring(0, 8)}...</td>
                    <td>${category.category_name || 'N/A'}</td>
                    <td>${category.description || 'N/A'}</td>
                    <td>${category.created_at ? new Date(category.created_at.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                    <td class="table-actions">
                        <button class="action-btn edit-btn" onclick="editCategory('${docSnap.id}')">Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteCategory('${docSnap.id}')">Delete</button>
                    </td>
                `;
                categoriesList.appendChild(row);
            }
        });
        
        await populateCategoryDropdown();
    } catch (error) {
        console.error("Error loading categories:", error);
    }
}

window.editCategory = async function(docId) {
    const category = categoriesData[docId];
    if (!category) return;
    
    document.getElementById('category-id').value = docId;
    document.getElementById('category-name').value = category.category_name || '';
    document.getElementById('category-description').value = category.description || '';
    
    document.getElementById('categories-form').scrollIntoView({ behavior: 'smooth' });
};

window.deleteCategory = async function(docId) {
    if (confirm('Are you sure you want to delete this category?')) {
        try {
            await deleteDoc(doc(db, "item_categories", docId));
            await loadCategories();
        } catch (error) {
            alert('Error deleting category: ' + error.message);
        }
    }
};

document.getElementById('save-category')?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const docId = document.getElementById('category-id').value;
    const categoryName = document.getElementById('category-name').value;
    const description = document.getElementById('category-description').value;
    
    try {
        const categoryData = { category_name: categoryName, description: description };
        
        if (docId) {
            await updateDoc(doc(db, "item_categories", docId), categoryData);
        } else {
            categoryData.created_at = serverTimestamp();
            await addDoc(collection(db, "item_categories"), categoryData);
        }
        
        document.getElementById('categories-form').reset();
        document.getElementById('category-id').value = '';
        await loadCategories();
    } catch (error) {
        alert('Error saving category: ' + error.message);
    }
});

// =====================================================
// CRUD - RENTAL ITEMS
// =====================================================
async function loadRentalItems() {
    try {
        const querySnapshot = await getDocs(collection(db, "rental_items"));
        rentalItemsData = {};
        const itemsList = document.getElementById('items-list');
        if (itemsList) itemsList.innerHTML = '';
        
        querySnapshot.forEach((docSnap) => {
            const item = { docId: docSnap.id, ...docSnap.data() };
            rentalItemsData[docSnap.id] = item;
            
            if (itemsList) {
                const category = categoriesData[item.category_id];
                const categoryName = category ? category.category_name : 'Unknown';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.id || docSnap.id.substring(0, 8)}...</td>
                    <td>${item.item_name || 'N/A'}</td>
                    <td>${categoryName}</td>
                    <td>${item.hourly_rate ? '₱' + item.hourly_rate.toFixed(2) + '/hr' : 'N/A'}</td>
                    <td><span class="status-badge status-${item.status || 'available'}">${item.status || 'Available'}</span></td>
                    <td>${item.created_at ? new Date(item.created_at.seconds * 1000).toLocaleDateString() : 'N/A'}</td>
                    <td class="table-actions">
                        <button class="action-btn edit-btn" onclick="editItem('${docSnap.id}')">Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteItem('${docSnap.id}')">Delete</button>
                    </td>
                `;
                itemsList.appendChild(row);
            }
        });
        
        await populateCategoryDropdown();
    } catch (error) {
        console.error("Error loading rental items:", error);
    }
}

window.editItem = async function(docId) {
    const item = rentalItemsData[docId];
    if (!item) return;
    
    document.getElementById('item-id').value = docId;
    document.getElementById('category-id-select').value = item.category_id || '';
    document.getElementById('item-name').value = item.item_name || '';
    document.getElementById('item-description').value = item.description || '';
    document.getElementById('hourly-rate').value = item.hourly_rate || 0;
    document.getElementById('item-status').value = item.status || 'available';
    
    document.getElementById('rental-items-form').scrollIntoView({ behavior: 'smooth' });
};

window.deleteItem = async function(docId) {
    if (confirm('Are you sure you want to delete this item?')) {
        try {
            await deleteDoc(doc(db, "rental_items", docId));
            await loadRentalItems();
        } catch (error) {
            alert('Error deleting item: ' + error.message);
        }
    }
};

document.getElementById('save-item')?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const docId = document.getElementById('item-id').value;
    const categoryId = document.getElementById('category-id-select').value;
    const itemName = document.getElementById('item-name').value;
    const description = document.getElementById('item-description').value;
    const hourlyRate = parseFloat(document.getElementById('hourly-rate').value);
    const status = document.getElementById('item-status').value;
    
    try {
        const itemData = {
            category_id: categoryId,
            item_name: itemName,
            description: description,
            hourly_rate: hourlyRate,
            status: status,
            updated_at: serverTimestamp()
        };
        
        if (docId) {
            await updateDoc(doc(db, "rental_items", docId), itemData);
        } else {
            itemData.created_at = serverTimestamp();
            await addDoc(collection(db, "rental_items"), itemData);
        }
        
        document.getElementById('rental-items-form').reset();
        document.getElementById('item-id').value = '';
        await loadRentalItems();
    } catch (error) {
        alert('Error saving rental item: ' + error.message);
    }
});

// =====================================================
// CRUD - RENTAL DETAILS
// =====================================================
async function loadRentalDetails() {
    try {
        const querySnapshot = await getDocs(collection(db, "rental_details"));
        rentalDetailsData = {};
        const rentalDetailsList = document.getElementById('rental-details-list');
        if (rentalDetailsList) rentalDetailsList.innerHTML = '';
        
        querySnapshot.forEach((docSnap) => {
            const detail = { docId: docSnap.id, ...docSnap.data() };
            rentalDetailsData[docSnap.id] = detail;
            
            if (rentalDetailsList) {
                const item = rentalItemsData[detail.item_id];
                const itemName = item ? item.item_name : 'Unknown Item';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${detail.id || docSnap.id.substring(0, 8)}...</td>
                    <td>${detail.rental_id ? detail.rental_id.substring(0, 8) + '...' : 'N/A'}</td>
                    <td>${itemName}</td>
                    <td>${detail.hourly_rate ? '₱' + detail.hourly_rate.toFixed(2) : 'N/A'}</td>
                    <td>${detail.hours || 'N/A'}</td>
                    <td>${detail.subtotal ? '₱' + detail.subtotal.toFixed(2) : 'N/A'}</td>
                    <td class="table-actions">
                        <button class="action-btn edit-btn" onclick="editRentalDetail('${docSnap.id}')">Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteRentalDetail('${docSnap.id}')">Delete</button>
                    </td>
                `;
                rentalDetailsList.appendChild(row);
            }
        });
        
        await populateUserDropdown();
        await populateCategoryDropdown();
    } catch (error) {
        console.error("Error loading rental details:", error);
    }
}

window.editRentalDetail = async function(docId) {
    const detail = rentalDetailsData[docId];
    if (!detail) return;
    
    document.getElementById('rental-detail-id').value = docId;
    document.getElementById('detail-rental-id').value = detail.rental_id || '';
    document.getElementById('detail-item-id').value = detail.item_id || '';
    document.getElementById('detail-hourly-rate').value = detail.hourly_rate || 0;
    document.getElementById('detail-hours').value = detail.hours || 1;
    window.AppUtils.calculateSubtotal();
    
    document.getElementById('rental-details-form').scrollIntoView({ behavior: 'smooth' });
};

window.deleteRentalDetail = async function(docId) {
    if (confirm('Are you sure you want to delete this rental detail?')) {
        try {
            await deleteDoc(doc(db, "rental_details", docId));
            await loadRentalDetails();
        } catch (error) {
            alert('Error deleting rental detail: ' + error.message);
        }
    }
};

document.getElementById('save-rental-detail')?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const docId = document.getElementById('rental-detail-id').value;
    const rentalId = document.getElementById('detail-rental-id').value;
    const itemId = document.getElementById('detail-item-id').value;
    const hourlyRate = parseFloat(document.getElementById('detail-hourly-rate').value);
    const hours = parseInt(document.getElementById('detail-hours').value);
    const subtotal = parseFloat(document.getElementById('detail-subtotal').value);
    
    try {
        const detailData = {
            rental_id: rentalId,
            item_id: itemId,
            hourly_rate: hourlyRate,
            hours: hours,
            subtotal: subtotal
        };
        
        if (docId) {
            await updateDoc(doc(db, "rental_details", docId), detailData);
        } else {
            await addDoc(collection(db, "rental_details"), detailData);
        }
        
        document.getElementById('rental-details-form').reset();
        document.getElementById('rental-detail-id').value = '';
        document.getElementById('detail-subtotal').value = '';
        await loadRentalDetails();
    } catch (error) {
        alert('Error saving rental detail: ' + error.message);
    }
});

// =====================================================
// CRUD - DELIVERIES
// =====================================================
async function loadDeliveries() {
    try {
        const querySnapshot = await getDocs(collection(db, "deliveries"));
        deliveriesData = {};
        const deliveriesList = document.getElementById('deliveries-list');
        if (deliveriesList) deliveriesList.innerHTML = '';
        
        querySnapshot.forEach((docSnap) => {
            const delivery = { docId: docSnap.id, ...docSnap.data() };
            deliveriesData[docSnap.id] = delivery;
            
            if (deliveriesList) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${delivery.id || docSnap.id.substring(0, 8)}...</td>
                    <td>${delivery.rental_id ? delivery.rental_id.substring(0, 8) + '...' : 'N/A'}</td>
                    <td>${delivery.delivery_address || 'N/A'}</td>
                    <td><span class="status-badge status-${delivery.delivery_status || 'pending'}">${delivery.delivery_status || 'Pending'}</span></td>
                    <td class="table-actions">
                        <button class="action-btn edit-btn" onclick="editDelivery('${docSnap.id}')">Edit</button>
                        <button class="action-btn delete-btn" onclick="deleteDelivery('${docSnap.id}')">Delete</button>
                    </td>
                `;
                deliveriesList.appendChild(row);
            }
        });
    } catch (error) {
        console.error("Error loading deliveries:", error);
    }
}

window.editDelivery = async function(docId) {
    const delivery = deliveriesData[docId];
    if (!delivery) return;
    
    document.getElementById('delivery-id').value = docId;
    document.getElementById('delivery-rental-id').value = delivery.rental_id || '';
    document.getElementById('delivery-address').value = delivery.delivery_address || '';
    document.getElementById('delivery-status').value = delivery.delivery_status || 'pending';
    
    document.getElementById('deliveries-form').scrollIntoView({ behavior: 'smooth' });
};

window.deleteDelivery = async function(docId) {
    if (confirm('Are you sure you want to delete this delivery?')) {
        try {
            await deleteDoc(doc(db, "deliveries", docId));
            await loadDeliveries();
        } catch (error) {
            alert('Error deleting delivery: ' + error.message);
        }
    }
};

document.getElementById('save-delivery')?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const docId = document.getElementById('delivery-id').value;
    const rentalId = document.getElementById('delivery-rental-id').value;
    const deliveryAddress = document.getElementById('delivery-address').value;
    const deliveryStatus = document.getElementById('delivery-status').value;
    
    try {
        const deliveryData = {
            rental_id: rentalId,
            delivery_address: deliveryAddress,
            delivery_status: deliveryStatus
        };
        
        if (docId) {
            await updateDoc(doc(db, "deliveries", docId), deliveryData);
        } else {
            await addDoc(collection(db, "deliveries"), deliveryData);
        }
        
        document.getElementById('deliveries-form').reset();
        document.getElementById('delivery-id').value = '';
        await loadDeliveries();
    } catch (error) {
        alert('Error saving delivery: ' + error.message);
    }
});

// =====================================================
// CRUD - PAYMENTS
// =====================================================
async function loadPayments() {
    try {
        const querySnapshot = await getDocs(collection(db, "payments"));
        paymentsData = {};
        const paymentsList = document.getElementById('payments-list');
        if (paymentsList) paymentsList.innerHTML = '';
        
        querySnapshot.forEach((docSnap) => {
            const payment = { docId: docSnap.id, ...docSnap.data() };
            paymentsData[docSnap.id] = payment;
            
            if (paymentsList) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${payment.id || docSnap.id.substring(0, 8)}...</td>
                    <td>${payment.rental_id ? payment.rental_id.substring(0, 8) + '...' : 'N/A'}</td>
                    <td>${payment.payment_method || 'N/A'}</td>
                    <td><span class="status-badge ${payment.payment_status === 'paid' ? 'status-paid' : 'status-unpaid'}">${payment.payment_status || 'Unpaid'}</span></td>
                    <td>${payment.payment_date || 'N/A'}</td>
                    <td class="table-actions">
                        <button class="action-btn edit-btn" onclick="editPayment('${docSnap.id}')">Edit</button>
                        <button class="action-btn delete-btn" onclick="deletePayment('${docSnap.id}')">Delete</button>
                    </td>
                `;
                paymentsList.appendChild(row);
            }
        });
    } catch (error) {
        console.error("Error loading payments:", error);
    }
}

window.editPayment = async function(docId) {
    const payment = paymentsData[docId];
    if (!payment) return;
    
    document.getElementById('payment-id').value = docId;
    document.getElementById('payment-rental-id').value = payment.rental_id || '';
    document.getElementById('payment-method').value = payment.payment_method || 'cash';
    document.getElementById('payment-status').value = payment.payment_status || 'unpaid';
    document.getElementById('payment-date').value = payment.payment_date || '';
    
    document.getElementById('payments-form').scrollIntoView({ behavior: 'smooth' });
};

window.deletePayment = async function(docId) {
    if (confirm('Are you sure you want to delete this payment?')) {
        try {
            await deleteDoc(doc(db, "payments", docId));
            await loadPayments();
        } catch (error) {
            alert('Error deleting payment: ' + error.message);
        }
    }
};

document.getElementById('save-payment')?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    const docId = document.getElementById('payment-id').value;
    const rentalId = document.getElementById('payment-rental-id').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const paymentStatus = document.getElementById('payment-status').value;
    const paymentDate = document.getElementById('payment-date').value;
    
    try {
        const paymentData = {
            rental_id: rentalId,
            payment_method: paymentMethod,
            payment_status: paymentStatus,
            payment_date: paymentDate
        };
        
        if (docId) {
            await updateDoc(doc(db, "payments", docId), paymentData);
        } else {
            await addDoc(collection(db, "payments"), paymentData);
        }
        
        document.getElementById('payments-form').reset();
        document.getElementById('payment-id').value = '';
        window.AppUtils.setDefaultDates();
        await loadPayments();
    } catch (error) {
        alert('Error saving payment: ' + error.message);
    }
});

// =====================================================
// AUTH STATE OBSERVER
// =====================================================
auth.onAuthStateChanged(async (user) => {
    if (user) {
        authSection.classList.add('hidden');
        appContainer.classList.remove('hidden');
        
        // Update user display
        window.AppUtils.updateUserDisplay(user.email, 'Customer');
        
        // Load all data
        await loadUsers();
        await loadCategories();
        await loadRentalItems();
        await loadRentals();
        await loadRentalDetails();
        await loadDeliveries();
        await loadPayments();
    } else {
        authSection.classList.remove('hidden');
        appContainer.classList.add('hidden');
    }
});

// =====================================================
// AUTH EVENT LISTENERS
// =====================================================
loginBtn?.addEventListener('click', async () => {
    const email = emailInput.value;
    const password = passwordInput.value;
    
    if (!email || !password) {
        window.AppUtils.showAuthMessage('Please enter both email and password', 'error');
        return;
    }
    
    await loginUser(email, password);
});

registerBtn?.addEventListener('click', async () => {
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;
    
    if (!email || !password) {
        window.AppUtils.showAuthMessage('Please enter both email and password', 'error');
        return;
    }
    
    if (password.length < 6) {
        window.AppUtils.showAuthMessage('Password should be at least 6 characters', 'error');
        return;
    }
    
    await registerUser(email, password);
});

logoutBtn?.addEventListener('click', async () => {
    await logoutUser();
});
