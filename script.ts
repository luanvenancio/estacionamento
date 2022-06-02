interface Veiculo {
    modelo: string;
    placa: string;
    entrada: Date | string;
}

(function () {
    const $ = (query: string): HTMLInputElement | null =>
        document.querySelector(query);

    function calcTempo(mil: number) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);

        return `${min}m e ${sec}s`;
    }

    function patio() {
        function ler(): Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }

        function adicionar(veiculo: Veiculo, salva?: boolean) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${veiculo.modelo}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}">
                        <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.4em" height="1.4em" 
                        preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
                        <path
                        d="M6 7H5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7H6zm10.618-3L15 2H9L7.382 4H3v2h18V4z"/></svg>
                    </button>
                </td>
            `;
            row.querySelector(".delete")?.addEventListener(
                "click",
                function () {
                    remover(this.dataset.placa);
                }
            );

            $("#patio")?.appendChild(row);

            if (salva) salvar([...ler(), veiculo]);
        }

        function render() {
            $("#patio")!.innerHTML = "";

            const patio = ler();

            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }

        render();

        function remover(placa: string) {
            const { entrada, modelo } = ler().find(
                (veiculo) => veiculo.placa === placa
            );

            const tempo = calcTempo(
                new Date().getTime() - new Date(entrada).getTime()
            );
            if (
                !confirm(
                    `O veiculo ${modelo} permanenceu por ${tempo}. Deseja encerrar?`
                )
            )
                return;

            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            render();
        }

        function salvar(veiculos: Veiculo[]) {
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }

        return { ler, adicionar, remover, salvar, render };
    }

    patio().render;
    $("#cadastrar")?.addEventListener("click", () => {
        const modelo = $("#modelo")?.value;
        const placa = $("#placa")?.value;

        if (!modelo || !placa) {
            alert("Os campos modelo e placa são obrigatórios");
            return;
        }

        patio().adicionar(
            { modelo, placa, entrada: new Date().toUTCString() },
            true
        );

        fechaModal("modal-veiculo");
    });
})();

function iniciaModal(modalID) {
    const modal = document.getElementById(modalID);
    if (modal) {
        modal.classList.add("mostrar");
        modal.addEventListener("click", (e) => {
            if (
                (e.target as HTMLDivElement).id == modalID ||
                (e.target as HTMLButtonElement).className == "fechar"
            ) {
                fechaModal(modalID);
            }
        });
    }
}

function fechaModal(modalID) {
    const modal = document.getElementById(modalID);
    if (modal) {
        modal.classList.remove("mostrar");
    }
}
const adiciona = document.querySelector(".adicionaVeiculo");
adiciona.addEventListener("click", () => iniciaModal("modal-veiculo"));

document.addEventListener("scroll", () => {
    if (window.pageYOffset > 800) {
        iniciaModal("modal-veiculo");
    }
});
