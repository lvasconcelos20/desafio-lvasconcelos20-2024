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

    // Função para verificar se o bioma e o espaço são adequados
    podeAdicionarAnimal(animal, recinto, quantidade) {
        const infoAnimal = this.animais[animal.toUpperCase()];

        if (!infoAnimal || !recinto) return false;

        // Verifica se o bioma é compatível
        const biomaCompativel = infoAnimal.biomas.includes(recinto.bioma);

        // Verifica se há espaço suficiente (considerando 1 espaço extra se houver mais de uma espécie no recinto)
        const espacoExtra = (recinto.animais.length > 0) ? 1 : 0;
        const temEspaco = (recinto.tamanho - recinto.ocupacao) >= (infoAnimal.tamanho * quantidade + espacoExtra);

        return biomaCompativel && temEspaco;
    }

    // Função para verificar se há conflitos entre os animais (regras 2, 3, 4 e 5)
  
    verificaConflito(animal, recinto, quantidade) {
        const infoAnimal = this.animais[animal.toUpperCase()];
    
        
        if (animal.toUpperCase() === 'HIPOPOTAMO' && recinto.animais.length > 0 && recinto.bioma !== 'savana e rio') {
            return true; 
        }
    
       
        if (animal.toUpperCase() === 'MACACO' && recinto.animais.length === 0) {
            return true; 
        }
    
        
        if (infoAnimal.carnivoro) {
            const temOutraEspecie = recinto.animais.some(animalRecinto => {
                const infoAnimalRecinto = this.animais[animalRecinto.toUpperCase()];
                /
                return !infoAnimalRecinto || (infoAnimalRecinto.carnivoro && animalRecinto.toUpperCase() !== animal.toUpperCase());
            });
            if (temOutraEspecie) {
                return true; 
            }
        } else {
           
            const temCarnivoro = recinto.animais.some(animalRecinto => {
                const infoAnimalRecinto = this.animais[animalRecinto.toUpperCase()];
                return infoAnimalRecinto && infoAnimalRecinto.carnivoro;
            });
            if (temCarnivoro) {
                return true; 
            }
        }
    
        return false;
    }
   
    calculaOcupacaoComNovosAnimais(recinto, novoAnimal, quantidade) {
        
        let ocupacaoAtual = recinto.ocupacao; 
        
        const infoNovoAnimal = this.animais[novoAnimal.toUpperCase()];
        ocupacaoAtual += infoNovoAnimal.tamanho * quantidade;
    
     
        const especiesNoRecinto = new Set([...recinto.animais.map(a => a.toUpperCase())]);
    
       
        especiesNoRecinto.add(novoAnimal.toUpperCase());
    
        
        if (especiesNoRecinto.size > 1) {
            ocupacaoAtual += 1; 
        }
    
        return ocupacaoAtual;
    }
    analisaRecintos(animal, quantidade) {
        if (!this.animais[animal.toUpperCase()]) {
            return { erro: 'Animal inválido' };
        }
    
        if (quantidade <= 0) {
            return { erro: 'Quantidade inválida' };
        }
    
        const recintosViaveis = [];
    
        
        const recintosOrdenados = this.recintos.sort((a, b) => {
            const aTemAnimal = a.animais.includes(animal.toLowerCase());
            const bTemAnimal = b.animais.includes(animal.toLowerCase());
    
           
            if (aTemAnimal && !bTemAnimal) return -1;
            if (!aTemAnimal && bTemAnimal) return 1;
    
          
            if (a.ocupacao === 0 && b.ocupacao !== 0) return -1;
            if (b.ocupacao === 0 && a.ocupacao !== 0) return 1;
    
            return a.ocupacao - b.ocupacao; 
        });
    
        recintosOrdenados.forEach(recinto => {
            // Verifica se o animal pode ser adicionado ao recinto
            if (!this.podeAdicionarAnimal(animal, recinto, quantidade)) return;
    
            // Verifica se há conflitos com os animais existentes
            if (this.verificaConflito(animal, recinto, quantidade)) return;
    
            // Calcula a ocupação total do recinto após a adição do novo animal
            const ocupacaoComNovosAnimais = this.calculaOcupacaoComNovosAnimais(recinto, animal, quantidade);
            if (ocupacaoComNovosAnimais > recinto.tamanho) return;
    
            
            recintosViaveis.push(`Recinto ${recinto.numero} (espaço livre: ${recinto.tamanho - ocupacaoComNovosAnimais} total: ${recinto.tamanho})`);
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

