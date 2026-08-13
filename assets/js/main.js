document.addEventListener('DOMContentLoaded', () => {
    
    // ================= SLIDER LOGIC =================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');

    if (slides.length > 0) {
        let currentSlideIndex = 0;
        let slideInterval;

        const showSlide = (index) => {
            if (index >= slides.length) currentSlideIndex = 0;
            else if (index < 0) currentSlideIndex = slides.length - 1;
            else currentSlideIndex = index;
            
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[currentSlideIndex].classList.add('active');
            dots[currentSlideIndex].classList.add('active');
        };

        const nextSlide = () => showSlide(currentSlideIndex + 1);
        const prevSlide = () => showSlide(currentSlideIndex - 1);

        const resetInterval = () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 8000);
        };

        if(nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
        if(prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => { showSlide(index); resetInterval(); });
        });

        slideInterval = setInterval(nextSlide, 8000);
    }

    // ================= FORMATAÇÃO DA PLACA (MÁSCARA XXXXXXX) =================
    const placaInputs = document.querySelectorAll('input[name="placa"]');
    placaInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = this.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
            if (value.length > 7) {
                value = value.substring(0, 7);
            }
            this.value = value;
        });
    });

    // ================= GERADOR MENSAGEM WHATSAPP =================
    // NUMERO ATUALIZADO 
    const numeroWhatsApp = "5548996449815";

    // 1. Lógica do Select na Home 
    const selectServico = document.getElementById('servico');
    const placaGroupHome = document.getElementById('placa-group-home');
    if (selectServico && placaGroupHome) {
        selectServico.addEventListener('change', function() {
            if (this.value === 'Primeiro emplacamento') {
                placaGroupHome.style.display = 'none';
                document.getElementById('placa').value = '';
            } else {
                placaGroupHome.style.display = 'block';
            }
        });
    }

    // Lógica de Submit da Home
    const formHome = document.getElementById('form-orcamento-home');
    if (formHome) {
        formHome.addEventListener('submit', function(e) {
            e.preventDefault();
            const servico = document.getElementById('servico').value;
            const placa = document.getElementById('placa').value;
            
            let textoMsg = "Olá. Gostaria de fazer um orçamento.";
            
            let temServico = (servico && servico !== "Selecione o serviço");
            let temPlaca = (placa && placa.trim().length > 0);

            if (temServico && temPlaca) {
                textoMsg = `Olá. Gostaria de fazer um orçamento. ${servico}, placa ${placa}. Pode me ajudar por favor?`;
            } else if (temServico) {
                textoMsg = `Olá. Gostaria de fazer um orçamento. ${servico}. Pode me ajudar por favor?`;
            } else if (temPlaca) {
                textoMsg = `Olá. Gostaria de fazer um orçamento. Placa ${placa}. Pode me ajudar por favor?`;
            }

            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoMsg)}`;
            window.open(url, '_blank');
        });
    }

    // 2. Modais da Página de Serviços
    const modal = document.getElementById('service-modal');
    if (modal) {
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalForm = document.getElementById('form-modal');
        const serviceCards = document.querySelectorAll('.service-card');
        const closeBtn = document.querySelector('.modal-close');
        const inputPlacaModal = document.getElementById('modal-placa');
        const modalPlacaGroup = document.getElementById('modal-placa-group');
        
        // Abrir Modal
        serviceCards.forEach(card => {
            card.addEventListener('click', () => {
                const serviceName = card.querySelector('h3').innerText.trim();
                const serviceDescription = card.getAttribute('data-desc') || "";
                
                modalTitle.innerText = serviceName;
                modalDesc.innerText = serviceDescription;
                inputPlacaModal.value = ''; 
                
                if (serviceName.toLowerCase() === 'primeiro emplacamento') {
                    modalPlacaGroup.style.display = 'none';
                } else {
                    modalPlacaGroup.style.display = 'block';
                }

                modal.classList.add('active');
            });
        });

        // Fechar Modal 
        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        modal.addEventListener('click', (e) => {
            if(e.target === modal) modal.classList.remove('active');
        });

        // Submeter formulário do Modal
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const servico = modalTitle.innerText;
            const placa = inputPlacaModal.value;
            
            let textoMsg = `Olá. Gostaria de fazer um orçamento. ${servico}`;
            if (placa && placa.trim().length > 0 && modalPlacaGroup.style.display !== 'none') {
                textoMsg += `, placa ${placa}.`;
            } else {
                textoMsg += `.`;
            }
            textoMsg += " Pode me ajudar por favor?";
            
            const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(textoMsg)}`;
            window.open(url, '_blank');
            modal.classList.remove('active');
        });
    }
});
