// O código JS de litio.js permanece exatamente o mesmo da resposta anterior.
// Cole ele aqui.
document.addEventListener('DOMContentLoaded', () => {
    // Fator de eficiência/descarga fixa para Lítio (85%)
    const USABLE_CAPACITY_FACTOR_LITHIUM = 0.85;

    const autonomyForm = document.getElementById('autonomy-form-litio');
    const resultArea = document.getElementById('result-area-litio');

    // Inputs
    const capacityInput = document.getElementById('capacity-per-battery');
    const numBatteriesInput = document.getElementById('num-batteries');
    const consumptionInput = document.getElementById('avg-consumption');

    if (!autonomyForm) return; // Sai se o formulário não existir nesta página

    autonomyForm.addEventListener('submit', function(event) {
        event.preventDefault();

        resultArea.innerHTML = '';
        resultArea.style.display = 'none';

        const capacityPerBattery = parseFloat(capacityInput.value);
        const numBatteries = parseInt(numBatteriesInput.value, 10);
        const averageConsumption = parseFloat(consumptionInput.value);

        let errorMessage = '';
        let invalidInput = null;

        if (isNaN(capacityPerBattery) || capacityPerBattery <= 0) {
            errorMessage = 'Capacidade nominal inválida (deve ser > 0).';
            invalidInput = capacityInput;
        } else if (isNaN(numBatteries) || numBatteries <= 0) {
            errorMessage = 'Quantidade de baterias inválida (deve ser >= 1).';
            invalidInput = numBatteriesInput;
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

        const totalNominalCapacity = capacityPerBattery * numBatteries;
        const usableCapacity = totalNominalCapacity * USABLE_CAPACITY_FACTOR_LITHIUM;
        const autonomyHoursDecimal = usableCapacity / averageConsumption;

        const totalMinutes = Math.floor(autonomyHoursDecimal * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        resultArea.innerHTML = `
            <p><span class="label">Capacidade Total Nominal:</span> ${totalNominalCapacity.toFixed(1)} Ah</p>
            <p><span class="label">Capacidade Útil (${(USABLE_CAPACITY_FACTOR_LITHIUM * 100).toFixed(0)}%):</span> ${usableCapacity.toFixed(1)} Ah</p>
            <hr>
            <p><span class="label">Tempo Estimado de Autonomia:</span></p>
            <p><span class="value">${hours} hora${hours !== 1 ? 's' : ''} e ${minutes} minuto${minutes !== 1 ? 's' : ''}</span></p>
        `;
        resultArea.style.display = 'block';
        resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

     // Limpar resultado ao mudar inputs
     [capacityInput, numBatteriesInput, consumptionInput].forEach(input => {
        input?.addEventListener('input', () => { // Verifica se input existe
            if (resultArea.style.display !== 'none') {
                 resultArea.style.display = 'none';
                 resultArea.innerHTML = '';
            }
        });
     });
});
