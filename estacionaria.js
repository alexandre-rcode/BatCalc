document.addEventListener('DOMContentLoaded', () => {
    // Parâmetros para cálculo Estacionário
    const BATTERIES_PER_STRING = 4;
    const CAPACITY_PER_STRING_AH = 63; // Conforme exemplo do usuário
    const USABLE_CAPACITY_FACTOR_STATIONARY = 0.50; // 50% DoD recomendado para chumbo-ácido

    const autonomyForm = document.getElementById('autonomy-form-estacionaria');
    const resultArea = document.getElementById('result-area-estacionaria');

    // Inputs
    const numBatteriesTotalInput = document.getElementById('num-batteries-total');
    // === NOVOS INPUTS DE CONSUMO ===
    const consumptionInputF1 = document.getElementById('consumption-f1');
    const consumptionInputF2 = document.getElementById('consumption-f2');
    // ==============================

    if (!autonomyForm) return; // Sai se o formulário não existir nesta página

    autonomyForm.addEventListener('submit', function(event) {
        event.preventDefault();

        resultArea.innerHTML = '';
        resultArea.style.display = 'none';

        // Obter valores dos inputs
        const totalBatteries = parseInt(numBatteriesTotalInput.value, 10);
        const consumptionF1 = parseFloat(consumptionInputF1.value); // Consumo Fonte 1
        const consumptionF2 = parseFloat(consumptionInputF2.value); // Consumo Fonte 2

        let errorMessage = '';
        let invalidInput = null;

        // Validação
        if (isNaN(totalBatteries) || totalBatteries <= 0) {
            errorMessage = 'Quantidade total de baterias inválida (deve ser > 0).';
            invalidInput = numBatteriesTotalInput;
        } else if (totalBatteries % BATTERIES_PER_STRING !== 0) {
             errorMessage = `A quantidade total de baterias (${totalBatteries}) deve ser um múltiplo de ${BATTERIES_PER_STRING} para formar strings de 48V.`;
             invalidInput = numBatteriesTotalInput;
        // === VALIDAÇÃO DOS NOVOS INPUTS ===
        } else if (isNaN(consumptionF1) || consumptionF1 < 0) { // Permite 0, mas não negativo
            errorMessage = 'Consumo Fonte 01 inválido (deve ser >= 0).';
            invalidInput = consumptionInputF1;
        } else if (isNaN(consumptionF2) || consumptionF2 < 0) { // Permite 0, mas não negativo
            errorMessage = 'Consumo Fonte 02 inválido (deve ser >= 0).';
            invalidInput = consumptionInputF2;
        }
        // ====================================

        // Se não houve erro até aqui, calcula o consumo total
        let totalConsumption = NaN;
        if (!errorMessage) {
             totalConsumption = consumptionF1 + consumptionF2; // SOMA OS DOIS CONSUMOS
             if (totalConsumption === 0) {
                 errorMessage = 'Com consumo total zero (0 A), a autonomia é teoricamente infinita.';
                 invalidInput = consumptionInputF1; // Foca no primeiro campo de consumo
             }
        }

        // Exibe erro se houver
        if (errorMessage) {
            resultArea.innerHTML = `<p class="error">${errorMessage}</p>`;
            resultArea.style.display = 'block';
            if (invalidInput) invalidInput.focus();
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Cálculos Principais (agora usando totalConsumption)
        const numStrings = totalBatteries / BATTERIES_PER_STRING;
        const totalNominalCapacity = numStrings * CAPACITY_PER_STRING_AH;
        const usableCapacity = totalNominalCapacity * USABLE_CAPACITY_FACTOR_STATIONARY;
        const autonomyHoursDecimal = usableCapacity / totalConsumption; // Usa a SOMA

        // Formatação do Tempo
        const totalMinutes = Math.floor(autonomyHoursDecimal * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        // Exibição do Resultado
        resultArea.innerHTML = `
            <p><span class="label">Nº de Strings (4x12V):</span> ${numStrings}</p>
            <p><span class="label">Capacidade Total Nominal (${numStrings} x ${CAPACITY_PER_STRING_AH}Ah):</span> ${totalNominalCapacity.toFixed(1)} Ah</p>
            <p><span class="label">Capacidade Útil (${(USABLE_CAPACITY_FACTOR_STATIONARY * 100).toFixed(0)}% DoD):</span> ${usableCapacity.toFixed(1)} Ah</p>
            <p><span class="label">Consumo Total Calculado (F1 + F2):</span> ${totalConsumption.toFixed(1)} A</p> <!-- Mostra a soma -->
            <hr>
            <p><span class="label">Tempo Estimado de Autonomia:</span></p>
            <p><span class="value">${hours} hora${hours !== 1 ? 's' : ''} e ${minutes} minuto${minutes !== 1 ? 's' : ''}</span></p>
        `;
        resultArea.style.display = 'block';
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

     // Limpar resultado ao mudar inputs (ATUALIZADO)
     [numBatteriesTotalInput, consumptionInputF1, consumptionInputF2].forEach(input => { // Inclui os dois novos inputs
        input?.addEventListener('input', () => {
            if (resultArea.style.display !== 'none') {
                 resultArea.style.display = 'none';
                 resultArea.innerHTML = '';
            }
        });
     });
});
