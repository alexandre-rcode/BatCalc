// O código JS de estacionaria.js permanece exatamente o mesmo da resposta anterior.
// Cole ele aqui.
document.addEventListener('DOMContentLoaded', () => {
    // Parâmetros para cálculo Estacionário
    const BATTERIES_PER_STRING = 4;
    const CAPACITY_PER_STRING_AH = 63; // Conforme exemplo do usuário
    const USABLE_CAPACITY_FACTOR_STATIONARY = 0.50; // 50% DoD recomendado para chumbo-ácido

    const autonomyForm = document.getElementById('autonomy-form-estacionaria');
    const resultArea = document.getElementById('result-area-estacionaria');

    // Inputs
    const numBatteriesTotalInput = document.getElementById('num-batteries-total');
    const consumptionInput = document.getElementById('avg-consumption-est');

    if (!autonomyForm) return; // Sai se o formulário não existir nesta página

    autonomyForm.addEventListener('submit', function(event) {
        event.preventDefault();

        resultArea.innerHTML = '';
        resultArea.style.display = 'none';

        const totalBatteries = parseInt(numBatteriesTotalInput.value, 10);
        const averageConsumption = parseFloat(consumptionInput.value);

        let errorMessage = '';
        let invalidInput = null;

        if (isNaN(totalBatteries) || totalBatteries <= 0) {
            errorMessage = 'Quantidade total de baterias inválida (deve ser > 0).';
            invalidInput = numBatteriesTotalInput;
        } else if (totalBatteries % BATTERIES_PER_STRING !== 0) {
             errorMessage = `A quantidade total de baterias (${totalBatteries}) deve ser um múltiplo de ${BATTERIES_PER_STRING} para formar strings de 48V.`;
             invalidInput = numBatteriesTotalInput;
        } else if (isNaN(averageConsumption) || averageConsumption < 0) {
            errorMessage = 'Consumo médio inválido (deve ser >= 0).';
            invalidInput = consumptionInput;
        } else if (averageConsumption === 0) {
             errorMessage = 'Com consumo zero (0 A), a autonomia é teoricamente infinita.';
        }

        if (errorMessage) {
            resultArea.innerHTML = `<p class="error">${errorMessage}</p>`;
            resultArea.style.display = 'block';
            if (invalidInput) invalidInput.focus();
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        const numStrings = totalBatteries / BATTERIES_PER_STRING;
        const totalNominalCapacity = numStrings * CAPACITY_PER_STRING_AH;
        const usableCapacity = totalNominalCapacity * USABLE_CAPACITY_FACTOR_STATIONARY;
        const autonomyHoursDecimal = usableCapacity / averageConsumption;

        const totalMinutes = Math.floor(autonomyHoursDecimal * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        resultArea.innerHTML = `
            <p><span class="label">Nº de Strings (4x12V):</span> ${numStrings}</p>
            <p><span class="label">Capacidade Total Nominal (${numStrings} x ${CAPACITY_PER_STRING_AH}Ah):</span> ${totalNominalCapacity.toFixed(1)} Ah</p>
            <p><span class="label">Capacidade Útil (${(USABLE_CAPACITY_FACTOR_STATIONARY * 100).toFixed(0)}% DoD):</span> ${usableCapacity.toFixed(1)} Ah</p>
            <hr>
            <p><span class="label">Tempo Estimado de Autonomia:</span></p>
            <p><span class="value">${hours} hora${hours !== 1 ? 's' : ''} e ${minutes} minuto${minutes !== 1 ? 's' : ''}</span></p>
        `;
        resultArea.style.display = 'block';
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

     // Limpar resultado ao mudar inputs
     [numBatteriesTotalInput, consumptionInput].forEach(input => {
        input?.addEventListener('input', () => { // Verifica se input existe
            if (resultArea.style.display !== 'none') {
                 resultArea.style.display = 'none';
                 resultArea.innerHTML = '';
            }
        });
     });
});
