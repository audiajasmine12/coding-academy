document.addEventListener('DOMContentLoaded', () => {

    // --- 1. HYPERLINK & HASH ROUTING NAVIGATION ---
    const pages = {
        'home': document.getElementById('page-home'),
        'gallery': document.getElementById('page-gallery'),
        'pendaftaran': document.getElementById('page-pendaftaran')
    };

    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Handle Route Change via Hash (#home, #gallery, #pendaftaran)
    function handleRouting() {
        let hash = window.location.hash.replace('#', '');
        if (!pages[hash]) {
            hash = 'home'; // Default page
        }

        // Hide all pages, show target page
        Object.keys(pages).forEach(pageKey => {
            if (pages[pageKey]) {
                pages[pageKey].classList.remove('active');
            }
        });
        if (pages[hash]) {
            pages[hash].classList.add('active');
        }

        // Update Nav Link Active States
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${hash}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Close mobile menu
        mobileMenu.classList.add('hidden');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Listen to URL Hash Changes
    window.addEventListener('hashchange', handleRouting);
    // Initial Route Check
    handleRouting();

    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // --- 2. GALLERY FILTERING FUNCTIONALITY ---
    const filterButtons = document.querySelectorAll('.gallery-filter');
    const galleryCards = document.querySelectorAll('.gallery-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- 3. FORM VALIDATION & CONFIRMATION MODAL ---
    const form = document.getElementById('registration-form');
    const btnSubmit = document.getElementById('btn-submit');
    const modal = document.getElementById('confirm-modal');
    const modalBtnCancel = document.getElementById('modal-btn-cancel');
    const modalBtnConfirm = document.getElementById('modal-btn-confirm');

    const formContainer = document.getElementById('form-container');
    const resultContainer = document.getElementById('result-container');
    const btnRegisterAgain = document.getElementById('btn-register-again');

    // Input elements
    const inputNik = document.getElementById('nik');
    const inputNama = document.getElementById('nama');
    const inputNoHp = document.getElementById('nohp');
    const inputAlamat = document.getElementById('alamat');

    // Error elements
    const errNik = document.getElementById('error-nik');
    const errNama = document.getElementById('error-nama');
    const errJk = document.getElementById('error-jk');
    const errNoHp = document.getElementById('error-nohp');
    const errAlamat = document.getElementById('error-alamat');
    const errLang = document.getElementById('error-lang');

    // Only allow numbers in NIK & No HP
    if (inputNik) {
        inputNik.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }
    if (inputNoHp) {
        inputNoHp.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // Validate Form Fields
    function validateForm() {
        let isValid = true;

        // Reset errors
        [errNik, errNama, errJk, errNoHp, errAlamat, errLang].forEach(err => err.classList.add('hidden'));

        // NIK Validation (16 digits)
        if (!inputNik.value || inputNik.value.length !== 16) {
            errNik.classList.remove('hidden');
            isValid = false;
        }

        // Nama Validation
        if (!inputNama.value.trim()) {
            errNama.classList.remove('hidden');
            isValid = false;
        }

        // Jenis Kelamin Validation
        const selectedJk = document.querySelector('input[name="jenis_kelamin"]:checked');
        if (!selectedJk) {
            errJk.classList.remove('hidden');
            isValid = false;
        }

        // No HP Validation (min 10 digits)
        if (!inputNoHp.value || inputNoHp.value.length < 10) {
            errNoHp.classList.remove('hidden');
            isValid = false;
        }

        // Alamat Validation
        if (!inputAlamat.value.trim()) {
            errAlamat.classList.remove('hidden');
            isValid = false;
        }

        // Bahasa Pemrograman Checkboxes
        const selectedLangs = document.querySelectorAll('input[name="lang"]:checked');
        if (selectedLangs.length === 0) {
            errLang.classList.remove('hidden');
            isValid = false;
        }

        return isValid;
    }

    // Modal Control Functions
    function openModal() {
        modal.classList.add('show');
        document.body.classList.add('modal-open');
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
    }

    // Click "Simpan Pendaftaran"
    if (btnSubmit) {
        btnSubmit.addEventListener('click', (e) => {
            e.preventDefault();
            if (validateForm()) {
                openModal();
            }
        });
    }

    // Cancel Modal
    if (modalBtnCancel) {
        modalBtnCancel.addEventListener('click', closeModal);
    }

    // Click "Ya, Saya Yakin" (Confirm)
    if (modalBtnConfirm) {
        modalBtnConfirm.addEventListener('click', () => {
            closeModal();

            // Collect Data
            const nik = inputNik.value;
            const nama = inputNama.value;
            const jk = document.querySelector('input[name="jenis_kelamin"]:checked').value;
            const nohp = inputNoHp.value;
            const alamat = inputAlamat.value;

            const selectedLangs = Array.from(document.querySelectorAll('input[name="lang"]:checked'))
                .map(cb => cb.value);

            // Populate Result Display
            document.getElementById('res-nik').textContent = nik;
            document.getElementById('res-nama').textContent = nama;
            document.getElementById('res-jk').textContent = jk;
            document.getElementById('res-nohp').textContent = nohp;
            document.getElementById('res-alamat').textContent = alamat;

            const langContainer = document.getElementById('res-lang');
            langContainer.innerHTML = '';
            selectedLangs.forEach(lang => {
                const badge = document.createElement('span');
                badge.className = 'px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium text-xs';
                badge.textContent = lang;
                langContainer.appendChild(badge);
            });

            // Switch view from Form to Result
            formContainer.classList.add('hidden');
            resultContainer.classList.remove('hidden');

            window.scrollTo({ top: resultContainer.offsetTop - 100, behavior: 'smooth' });
        });
    }

    // Reset / Register Again
    if (btnRegisterAgain) {
        btnRegisterAgain.addEventListener('click', () => {
            resultContainer.classList.add('hidden');
            formContainer.classList.remove('hidden');
        });
    }

});