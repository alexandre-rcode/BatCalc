document.addEventListener('DOMContentLoaded', () => {
    // Parâmetros para cálculo Estacionário
    const BATTERIES_PER_STRING = 4;
    const CAPACITY_PER_STRING_AH = 63; // Conforme exemplo do usuário
    const USABLE_CAPACITY_FACTOR_STATIONARY = 0.50; // 50% DoD recomendado para chumbo-ácido

    const autonomyForm = document.getElementById('autonomy-form-estacionaria');
    const resultArea = document.getElementById('result-area-estacionaria');

    // Inputs - Pegando os IDs CORRETOS do HTML acima
    const numBatteriesTotalInput = document.getElementById('num-batteries-total');
    const consumptionInputF1 = document.getElementById('consumption-f1'); // Input Fonte 1
    const consumptionInputF2 = document.getElementById('consumption-f2'); // Input Fonte 2

    // Verifica se o formulário existe nesta página antes de adicionar o listener
    if (!autonomyForm) {
        console.error("Formulário 'autonomy-form-estacionaria' não encontrado.");
        return;
    }
    // Verifica se os inputs existem
     if (!numBatteriesTotalInput || !consumptionInputF1 || !consumptionInputF2 || !resultArea) {
        console.error("Um ou mais elementos do formulário/resultado não foram encontrados.");
        return;
    }


    autonomyForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão

        resultArea.innerHTML = ''; // Limpa resultado anterior
        resultArea.style.display = 'none'; // Esconde resultado anterior

        // Obter valores dos inputs
        const totalBatteries = parseInt(numBatteriesTotalInput.value, 10);
        const consumptionF1 = parseFloat(consumptionInputF1.value); // Consumo Fonte 1
        const consumptionF2 = parseFloat(consumptionInputF2.value); // Consumo Fonte 2

        let errorMessage = '';
        let invalidInput = null;

        // Validação dos inputs
        if (isNaN(totalBatteries) || totalBatteries <= 0) {
            errorMessage = 'Quantidade total de baterias inválida (deve ser > 0).';
            invalidInput = numBatteriesTotalInput;
        } else if (totalBatteries % BATTERIES_PER_STRING !== 0) {
             errorMessage = `A quantidade total de baterias (${totalBatteries}) deve ser um múltiplo de ${BATTERIES_PER_STRING} para formar strings de 48V.`;
             invalidInput = numBatteriesTotalInput;
        } else if (isNaN(consumptionF1) || consumptionF1 < 0) { // Permite 0, mas não negativo
            errorMessage = 'Consumo Fonte 01 inválido (deve ser >= 0).';
            invalidInput = consumptionInputF1;
        } else if (isNaN(consumptionF2) || consumptionF2 < 0) { // Permite 0, mas não negativo
            errorMessage = 'Consumo Fonte 02 inválido (deve ser >= 0).';
            invalidInput = consumptionInputF2;
        }

        // Se não houve erro de validação, calcula o consumo total
        let totalConsumption = NaN;
        if (!errorMessage) {
             totalConsumption = consumptionF1 + consumptionF2; // SOMA OS DOIS CONSUMOS

             // Verifica se a soma é zero APÓS somar
             if (totalConsumption === 0) {
                 errorMessage = 'Com consumo total zero (0 A), a autonomia é teoricamente infinita.';
                 // Decide em qual campo focar se o total for zero (pode ser o primeiro)
                 invalidInput = consumptionInputF1;
             } else if (totalConsumption < 0) {
                 // Caso raro, mas se a soma der negativa (inputs negativos não validados antes?)
                 errorMessage = 'O consumo total calculado é negativo, verifique os valores das fontes.';
                 invalidInput = consumptionInputF1;
             }
        }

        // Exibe erro se houver e interrompe
        if (errorMessage) {
            resultArea.innerHTML = `<p class="error">${errorMessage}</p>`;
            resultArea.style.display = 'block';
            if (invalidInput) { // Foca no campo inválido
                invalidInput.focus();
            }
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return; // Interrompe a execução aqui
        }

        // --- Se chegou aqui, todos os inputs são válidos e a soma é > 0 ---

        // Cálculos Principais (usando totalConsumption)
        const numStrings = totalBatteries / BATTERIES_PER_STRING;
        const totalNominalCapacity = numStrings * CAPACITY_PER_STRING_AH;
        const usableCapacity = totalNominalCapacity * USABLE_CAPACITY_FACTOR_STATIONARY;

        // Calcula autonomia (agora podemos dividir com segurança)
        const autonomyHoursDecimal = usableCapacity / totalConsumption;

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

     // Limpar resultado ao mudar inputs (INCLUI OS NOVOS INPUTS)
     [numBatteriesTotalInput, consumptionInputF1, consumptionInputF2].forEach(input => {
        // Adiciona verificação extra para garantir que input não é null
        if(input) {
            input.addEventListener('input', () => {
                if (resultArea.style.display !== 'none') {
                     resultArea.style.display = 'none';
                     resultArea.innerHTML = '';
                }
            });
        } else {
            console.warn("Um elemento de input não foi encontrado ao adicionar listener.");
        }
     });
});
