export class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, ocupacao: 3, animais: ['macaco'] },
            { numero: 2, bioma: 'floresta', tamanho: 5, ocupacao: 0, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, ocupacao: 1, animais: ['gazela'] },
            { numero: 4, bioma: 'rio', tamanho: 8, ocupacao: 0, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, ocupacao: 1, animais: ['leão'] },
        ];

        this.animais = {
            LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
            LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
            CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
            MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
            HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false },
        };
    }

    // Verifica se o bioma é compatível
    podeAdicionarAnimal(animal, numeroRecinto) {
        const infoAnimal = this.animais[animal.toUpperCase()]; // Pega info do animal
        const recinto = this.recintos.find(r => r.numero === numeroRecinto); // Pega info do recinto

        if (!infoAnimal || !recinto) {
            return false;  // Se o animal ou o recinto não existirem, retorna falso
        }

        // Verifica se o bioma do recinto é compatível com o animal
        const biomaCompativel = infoAnimal.biomas.includes(recinto.bioma);

        // Verifica se o recinto tem espaço para o animal
        const temEspaco = (recinto.tamanho - recinto.ocupacao) >= infoAnimal.tamanho;

        // Retorna true se o bioma for compatível e houver espaço
        return biomaCompativel && temEspaco;
    }
    verificaConflito(animal, recinto) {
        const infoAnimal = this.animais[animal.toUpperCase()];

       
        return recinto.animais.some(animalRecinto => {
            const infoAnimalRecinto = this.animais[animalRecinto.toUpperCase()];

            
            if (!infoAnimalRecinto) {
                return false;  
            }

           
            if (infoAnimal.carnivoro !== infoAnimalRecinto.carnivoro) {
                return true;
            }

            return false;
        });
    }

  
    calculaOcupacaoComNovosAnimais(recinto, novoAnimal, quantidade) {
       
        let ocupacaoAtual = recinto.animais.reduce((total, animalRecinto) => {
            const infoAnimalRecinto = this.animais[animalRecinto.toUpperCase()];
            return total + (infoAnimalRecinto ? infoAnimalRecinto.tamanho : 1);
        }, 0);

        // Soma a ocupação dos novos animais (tamanho x quantidade)
        const infoNovoAnimal = this.animais[novoAnimal.toUpperCase()];
        ocupacaoAtual += infoNovoAnimal.tamanho * quantidade;

        // Verifica se há mais de uma espécie diferente no recinto e soma um se existir especies diferentes
        const especiesNoRecinto = new Set([...recinto.animais.map(a => a.toUpperCase()), novoAnimal.toUpperCase()]);
        if (especiesNoRecinto.size > 1) {
            ocupacaoAtual += 1
        }

        // Calcula o espaço restante
        const espacoRestante = recinto.tamanho - ocupacaoAtual;
        return espacoRestante;
    }

    // Método principal que analisa os recintos
    analisaRecintos(animal, quantidade) {
        if (!this.animais[animal.toUpperCase()]) {
            return { erro: 'Animal inválido' };
        }
        if (quantidade <= 0) {
            return { erro: 'Quantidade inválida' };
        }

        const infoAnimal = this.animais[animal.toUpperCase()];
        const recintosViaveis = [];

        this.recintos.forEach(recinto => {
            // Verifica bioma compatível
            if (!this.biomaCompatível(infoAnimal, recinto)) return;

            // Verifica se há conflitos entre carnívoros e herbívoros
            if (this.verificaConflito(animal, recinto)) return;

            // Calcula o espaço livre com os novos animais
            const espacoRestante = this.calculaOcupacaoComNovosAnimais(recinto, animal, quantidade);

            if (espacoRestante >= 0) {
                recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${espacoRestante} total: ${recinto.tamanho})`);
            }
        });

        if (recintosViaveis.length > 0) {
            return { recintosViaveis };
        } else {
            return { erro: 'Não há recinto viável' };
        }
    }
}


const zoologico = new RecintosZoo();
console.log(zoologico.analisaRecintos('MACACO', 2));
console.log(zoologico.analisaRecintos('LEAO', 1)); 
