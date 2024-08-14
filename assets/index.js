
function updateFileName() {
    document.getElementById('btn_').style.display = 'flex'
    const input = document.getElementById('file');
    const label = document.getElementById('fileLabel');
    const fileName = input.files[0] ? input.files[0].name : "Cliquez pour sélectionner un fichier CSV";
    label.textContent = fileName;
}



function outputFile() {
    const input = document.getElementById('file');
    document.getElementById('container_poppup').style.display = 'flex'
    if (input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            displayCSVContent(content);

        };
        reader.readAsText(file);
    }
}

function generate() {
    if (document.getElementById('progress_')) {
        document.getElementById('progress_').style.display = 'flex';
    }
    const input = document.getElementById('file');
    if (input.files.length > 0) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const GTableau = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            // let col = GTableau.slice(117, 210);
            let col = GTableau.slice(215, 243);
            cloture_cpt(col)

        };

        reader.readAsArrayBuffer(file);
    }
}

async function suppression_frais(col) {
    for (let i = 0; i < col.length; i++) {
        const element = col[i];
        // console.log(nouveauTableau);
        var angency = element[1] < 10 ? 'sipem_0000' + element[1] : 'sipem_000' + element[1]
        var cpt = element[3];

        var query2 = `
            DELETE from ${angency}.detail_mvt WHERE dmv_inummvt in(
            SELECT mvt_inum from mvt where mvt_vcodeclt LIKE '%${cpt}%' and  SUBSTR(mvt_vrecu,1,3)='FTC'
            and mvt_ddate in ('2024-07-01','2024-05-01')
            order BY mvt_ddate desc );
          `;

        var query = `
            DELETE from ${angency}.mvt  where mvt_vcodeclt LIKE '%${cpt}%' and  SUBSTR(mvt_vrecu,1,3)='FTC'
            and mvt_ddate in ('2024-07-01','2024-05-01')
            order BY mvt_ddate desc;
          `;
        // console.log(cpt);

        console.log();

    };
}

async function cloture_cpt(col) {
    for (let i = 0; i < col.length; i++) {
        const element = col[i];
        // console.log(nouveauTableau);
        var angency = element[1] < 10 ? 'sipem_0000' + element[1] : 'sipem_000' + element[1]
        var cpt = element[3];
        console.log();

    };

}


async function generateArray(content) {

    var GTableau = [];
    const temp = content.split('\n');
    let finalArray = [];
    temp.forEach(element => {
        GTableau.push(element.split(';'));
    });
    var k = 0;
    var l = 0;
    var rows = quickSort(GTableau);

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i];
        if (cells[0] != '' && cells[1] != '') {
            l++;
            document.getElementById('process').innerHTML = l;
        }
    }

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i];
        if (cells[0] != '' && cells[1] != '') {
            k++;
            finalArray.push(cells)
            setRequest(cells, k)
        }
    }

}
function setRequest(item, i) {

    console.log(item);

}

function formatNumber(num) {
    // Convert the number to a string, remove any existing spaces
    let numStr = num.toString().replace(/\s/g, '');
    // Use a regular expression to add a space every three digits
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
function getAccount(item, label) {
    // console.log(item[1], ' | ' + item[5], ' | ' + label, ' | ' + item[27]);
    return item[5].includes(label) ? item[27] : '0';
}
function getAccount_(item) {
    // console.log(item[1], ' | ' + item[5], ' | ' + label, ' | ' + item[27]);
    if (item[5].includes('CLASSIQUE') || item[5].includes('TAFA') || item[5].includes('EPARGNE') || item[5].includes('BLOQUE')) {
        return item[27]
    } else {
        return '0'
    }
}
function sortArray(array) {
    return array.sort((a, b) => {
        if (a[1] === b[1]) {
            return a[2].localeCompare(b[2]);
        } else {
            return a[0] - b[0];
        }
    });
}
function quickSort(arr) {
    return sortedArray = arr.slice().sort((a, b) => {
        return a[1] - b[1]
    });

}