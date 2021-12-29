interface Veiculo {
    nome: string;
    placa: string;
    entrada: Date | string;
    clientId?: number;
}

interface Pessoa {
    nomeCliente: string;
}

interface Cliente extends Pessoa {
    idCliente: number;
    veiculos?: Veiculo[];
}

(function () {
    const $ = (query: string) : HTMLInputElement | null => document.querySelector(query);

    function clientes() {
        function adicionarCliente(cliente: Cliente) {

            const rowCliente = document.createElement("tr");
            rowCliente.innerHTML = `
            <td>${cliente.idCliente}</td>
            <td>${cliente.nomeCliente}</td>
            `
            $("#clientes")?.appendChild(rowCliente);
        }

        return {adicionarCliente};
    }
        

    $("#cadastrarCliente").addEventListener("click", () => {
        const nomeCliente = $("#nomeCliente").value;
        const idCliente = parseInt($("#idCliente").value);
        
        if(!nomeCliente) {
            alert("O nome do cliente não pode ser nulo!");
            return;
        }
        
        clientes().adicionarCliente({idCliente, nomeCliente, veiculos: []});
        $("#idCliente").value = (idCliente+1).toString();
        $("#nomeCliente").value = "";

    })

})();

(function () {
    const $ = (query: string) : HTMLInputElement | null => document.querySelector(query);

    function patio(){
        function ler() : Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        
        function salvar(veiculos: Veiculo[]) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }

        function adicionar(veiculo: Veiculo, vaiSalvar?: boolean) {
            const row = document.createElement("tr");
            
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td><button class="delete" data-placa="${veiculo.placa}">X</button></td>`;

            row.querySelector(".delete")?.addEventListener("click", function(){
                remover(this.dataset.placa)
            })
            $("#patio")?.appendChild(row);
            
            if(vaiSalvar) salvar([...ler(), veiculo]);
        }

        function calcTempo(mil: number) {
            const min = Math.floor(mil/60000);
            const sec = Math.floor((mil % 60000) / 1000);

            return `${min}m e ${sec}s`;
        }

        function remover(placa: string) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());

            if(!confirm(`O veículo ${nome} permaneceu por ${tempo}, deseja encerrar?`)) return;
            salvar(ler().filter(veiculo => veiculo.placa !== placa));
            render();

        }

        function render() {
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if(patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }

        return {ler, adicionar, remover, salvar, render};
    }

    patio().render();

    $("#cadastrarVeiculo")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;

        if(!nome || !placa) {
            alert("Os campos nome e placa são obrigatórios!");
            return;
        }

        patio().adicionar({nome, placa, entrada: new Date().toISOString() }, true);
        $("#nome").value = "";
        $("#placa").value = "";
    });
})();