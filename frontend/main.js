const rowsPerPage = 10;

let cheeseDirectory;

let modal = document.getElementById("viewDetail");
let closeButtonModal = document.getElementById("closeButton");

let englishRadioButton = document.getElementById("english");
let frenchRadioButton = document.getElementById("french");

const searchNumInput = document.querySelector('input[id="searchNum"]');
let prevButton = document.getElementById("prev");
let nextButton = document.getElementById("next");
let mainTableBody = document.getElementById("mainTableBody");
let searchBox = document.getElementById("searchBox");

let fatContentSortButton = document.getElementById("fatContentSortButton");
let nameSortButton = document.getElementById("nameSortButton");
let moistureSortButton = document.getElementById("moistureSortButton");

let catagoryTable = document.getElementById("catagoryTable");
let firmCheese = document.getElementById("firmCheese");
let freshCheese = document.getElementById("freshCheese");
let hardCheese = document.getElementById("hardCheese");
let semiSoftCheese = document.getElementById("semiSoftCheese");
let softCheese = document.getElementById("softCheese");
let veinedCheese = document.getElementById("veinedCheese");
let uncategorized = document.getElementById("uncategorized");

// When a website loads, display the cheese data (uncategorized) in English.
// Initialize addEventListener functions.
window.onload = () => {
    uncategorized.style['border-bottom'] = "3px solid #5560ff";
    fetchData("", "english");
    catagoryTable.addEventListener('click', changeCategories);
    mainTableBody.addEventListener('click', showRowDetails);
    searchBox.addEventListener('input', searchByName);
    nameSortButton.addEventListener('click', sortByName);
    fatContentSortButton.addEventListener('click', sortByFatContent);
    moistureSortButton.addEventListener('click', sortByMoisture);
    searchNumInput.addEventListener('change', updatePageNum);
    prevButton.addEventListener('click', decreasePageNum);
    nextButton.addEventListener('click', increasePageNum);
    englishRadioButton.addEventListener('click', changeToEnglish);
    frenchRadioButton.addEventListener('click', changeToFrench);
    closeButtonModal.addEventListener('click', closeModal);
} // end of window.onload()

// If information in the selected language is empty, assign the information in the alternative language
// e.g. If a cheese name is empty in English, then use the name in French 
// If the flag, showNA, is set, return "N/A"
function fillEmpty(selected, alternative, showNA) {
    let information = selected;

    if (information === "") {
        information = alternative;
    }
    if (selected === "" && alternative === "") {
        if (showNA) {
            information = "N/A";
        }
    }
    return information;
} // end of fillEmpty()

// Given the current page number, calculate the starting index number and the ending index number
// to display the cheese data in the table
function calculatePageRange(currentPage) {
    let numTotalPages = Number(document.getElementById("numTotalPages").innerText);
    upTo = 1;
    startFrom = 1;
    currentPage = Number(currentPage);

    // Find the correct page range only if the value of the current page is valid
    if (currentPage > 0 && currentPage <= numTotalPages) {
        startFrom = (currentPage - 1) * rowsPerPage;
        upTo = currentPage * rowsPerPage;

        // If the current page is the last page, the ending index is up to the length of the cheeseDirectory data.
        if (currentPage === numTotalPages) {
            upTo = cheeseDirectory.length;
        }
    }
    return { "startFrom": startFrom, "upTo": upTo }; //return the values as an object
} // end of calculatePageRange()

// Return the current language based on which radio button is checked
function getCurrentLanguage() {
    let currentLanguage;

    if (document.getElementById("english").checked) {
        currentLanguage = "english";
    } else {
        currentLanguage = "french";
    }
    return currentLanguage;
} // end of getCurrentLanguage()

// Search by a cheese name
function searchByName() {
    if (this.value.length === 0) {
        document.getElementById("numPageDiv").style.display = "block";
        populateTable();
    } else { // When searching, do not display the pagination UI
        document.getElementById("numPageDiv").style.display = "none";
        populateTable(this.value);
    }
} // end of searchByName()

// Sort the cheese data by the given type : Name, Fat Content, or Moisture %
function sort(type, upDown) {

    if (type === "cheeseName") {
        if (upDown === "up") {
            cheeseDirectory.sort(function (f, n) {
                let first = fillEmpty(f.CheeseNameEn, f.CheeseNameFr);
                let last = fillEmpty(n.CheeseNameEn, n.CheeseNameFr);
                return first.localeCompare(last);
            });
        } else {
            cheeseDirectory.sort(function (f, n) {
                let first = fillEmpty(f.CheeseNameEn, f.CheeseNameFr);
                let last = fillEmpty(n.CheeseNameEn, n.CheeseNameFr);
                return last.localeCompare(first);
            });
        }
    } else if (type === "fatContent") {
        if (upDown === "up") {
            cheeseDirectory.sort(function (f, n) {
                return f.FatContentPercent - n.FatContentPercent;
            });
        } else {
            cheeseDirectory.sort(function (f, n) {
                return n.FatContentPercent - f.FatContentPercent;
            });
        }
    } else if (type === "moisture") {
        if (upDown === "up") {
            cheeseDirectory.sort(function (f, n) {
                return f.MoisturePercent - n.MoisturePercent;
            });
        } else {
            cheeseDirectory.sort(function (f, n) {
                return n.MoisturePercent - f.MoisturePercent;
            });
        }
    }
} // end of sort()

// Get data from the backend based on the category and the current language.
function fetchData(name, currentLanguage) {
    fetch(`http://127.0.0.1:3000/category?categoryType=${name}&currentLanguage=${currentLanguage}`)
        .then(response => response.json())
        .then(data => {
            cheeseDirectory = data;
            sort("cheeseName", "up");

            nameSortButton.style.color = "red";
            fatContentSortButton.style.color = "";
            moistureSortButton.style.color = "";

            // Now that the length of cheese data is known, set the total number of pages
            let numTotalPages = Math.ceil(cheeseDirectory.length / rowsPerPage);

            document.getElementById("numTotalPages").innerText = numTotalPages;

            var searchNum = document.getElementById("searchNum");

            searchNum.value = "1"; // starting number
            searchNum.setAttribute("max", numTotalPages);

            populateTable();
        }); // end of fetch
} // end of fetchData()

// Respond to a sort button click for the cheese name column
// Change the sort icon colour and update the table
function sortByName() {

    if (fatContentSortButton.style.color === "red") {
        fatContentSortButton.style.color = "";
    }
    if (moistureSortButton.style.color === "red") {
        moistureSortButton.style.color = "";
    }

    if (nameSortButton.style.color != "red" && nameSortButton.style.color != "") {
        nameSortButton.style.color = "red";
        sort("cheeseName", "up");
        populateTable();
    } else {
        nameSortButton.style.color = "grey";
        sort("cheeseName", "down");
        populateTable();
    }
} // end of sortByName()

// Respond to a sort button click for the fat content % column
function sortByFatContent() {

    if (nameSortButton.style.color === "red" || nameSortButton.style.color === "") {
        nameSortButton.style.color = "grey";
    }
    if (moistureSortButton.style.color === "red") {

        moistureSortButton.style.color = "";

    }
    if (fatContentSortButton.style.color != "red") {
        fatContentSortButton.style.color = "red";
        sort("fatContent", "up");
        populateTable();
    } else {
        fatContentSortButton.style.color = "";
        sort("fatContent", "down");
        populateTable();
    }
} // end of sortByFatContent()

// Respond to a sort button click for the moisture % column
function sortByMoisture() {

    if (nameSortButton.style.color === "red" || nameSortButton.style.color === "") {
        nameSortButton.style.color = "grey";
    }
    if (fatContentSortButton.style.color === "red") {
        fatContentSortButton.style.color = "";
    }

    if (moistureSortButton.style.color != "red") {
        moistureSortButton.style.color = "red";
        sort("moisture", "up");
        populateTable();
    } else {
        moistureSortButton.style.color = "";
        sort("moisture", "down");
        populateTable();
    }
}// end of sortByMoisture()

// Update the table when a page number changes
function updatePageNum() {
    populateTable();
} // end of updatePageNum

// Update the table when a page number decreases
function decreasePageNum() {
    let pageNum = Number(document.getElementById("searchNum").value);

    //Decrease the page number if it is greater than 1
    if (pageNum > 1) {
        pageNum = pageNum - 1;
    }

    document.getElementById("searchNum").value = pageNum;
    populateTable();
} // end of decreasePageNum()

// Update the table when a page number increases
function increasePageNum() {
    let pageNum = Number(document.getElementById("searchNum").value);

    if (pageNum < Number(document.getElementById("numTotalPages").innerText)) {
        pageNum = pageNum + 1;
    }

    document.getElementById("searchNum").value = pageNum;
    populateTable();
} // end of increasePageNum()

// Change words to English when the language preference changes to English
function changeToEnglish() {

    firmCheese.innerText = "Firm Cheese";
    freshCheese.innerText = "Fresh Cheese";
    hardCheese.innerText = "Hard Cheese";
    semiSoftCheese.innerText = "Semi-soft Cheese";
    softCheese.innerText = "Soft Cheese";
    veinedCheese.innerText = "Veined Cheeses";
    uncategorized.innerText = "Unclassified";

    document.getElementById("cheeseHeader").innerText = "Cheese Directory";
    document.getElementById("agricultureTitle").innerText = "from Agriculture and Agri-Food Canada";

    populateTable();
}// end of changeToEnglish()

// Change words to French when the language preference changes to French
function changeToFrench() {
    firmCheese.innerText = "Pâte ferme";
    freshCheese.innerText = "Pâte fraîche";
    hardCheese.innerText = "Pâte dure";
    semiSoftCheese.innerText = "Pâte demi-ferme";
    softCheese.innerText = "Pâte molle";
    veinedCheese.innerText = "Pâte persillée";
    uncategorized.innerText = "Non classé";

    document.getElementById("cheeseHeader").innerText = "Répertoire des fromages";
    document.getElementById("agricultureTitle").innerText = "d'Agriculture et Agroalimentaire Canada";

    populateTable();
}// end of changeToFrench()

// A close button for a modal window that gets shown when a user clicks a row
function closeModal() {
    modal.style.display = "none";
};// end of closeModal

// Find the index of the chosen cheese in the cheese directory
function findIndex(chosenRowCheeseName) {
    let pageRange = calculatePageRange(document.getElementById("searchNum").value);

    // If a user searches an item, look at the entire cheese directory
    if (document.getElementById("numPageDiv").style.display === "none") {
        pageRange.startFrom = 0;
        pageRange.upTo = cheeseDirectory.length;
    }

    var chosenCheeseIndex = pageRange.startFrom;
    var indexNotFound = true;

    while (chosenCheeseIndex < pageRange.upTo && indexNotFound) {
        let currentLanguage = getCurrentLanguage();
        let name = fillEmpty(cheeseDirectory[chosenCheeseIndex].CheeseNameEn, cheeseDirectory[chosenCheeseIndex].CheeseNameFr);

        if (currentLanguage === "french") {
            name = fillEmpty(cheeseDirectory[chosenCheeseIndex].CheeseNameFr, cheeseDirectory[chosenCheeseIndex].CheeseNameEn);
        }

        if (name === chosenRowCheeseName) {
            indexNotFound = false;
        } else {
            chosenCheeseIndex++;
        } // end of if-else

    }// end of while loop
    return chosenCheeseIndex;
} // end of findIndex()

// Display the rest of information that is not in the table
function viewDetails(chosenRow) {

    var i = findIndex(chosenRow); // chosen cheese index

    modal.style.display = "block"; // display the pop-up screen

    manufacturerTable.innerHTML = ""; // newly create a table when a user selects a row

    // Columns
    manufacturerTable.insertRow().innerHTML =
        "<th> Name </th>" +
        "<th> Province </th>" +
        "<th> Manufacturing Type </th>" +
        "<th> Website </th>";

    // Set information
    let manufacturerName = fillEmpty(cheeseDirectory[i].ManufacturerNameEn, cheeseDirectory[i].ManufacturerNameFr, true);
    let manufacturerWebsite = fillEmpty(cheeseDirectory[i].WebSiteEn, cheeseDirectory[i].WebSiteFr, true);
    let manufacturingType = fillEmpty(cheeseDirectory[i].ManufacturingTypeEn, cheeseDirectory[i].ManufacturingTypeFr, true);

    let cheeseName = fillEmpty(cheeseDirectory[i].CheeseNameEn, cheeseDirectory[i].CheeseNameFr, true);
    let particularities = fillEmpty(cheeseDirectory[i].ParticularitiesEn, cheeseDirectory[i].ParticularitiesFr, true);
    let flavour = fillEmpty(cheeseDirectory[i].FlavourEn, cheeseDirectory[i].FlavourFr, true);
    let characteristics = fillEmpty(cheeseDirectory[i].CharacteristicsEn, cheeseDirectory[i].CharacteristicsFr, true);
    let ripening = fillEmpty(cheeseDirectory[i].RipeningEn, cheeseDirectory[i].RipeningFr, true);
    let rindType = fillEmpty(cheeseDirectory[i].RindTypeEn, cheeseDirectory[i].RindTypeFr, true);

    if (getCurrentLanguage() === "french") {

        manufacturerName = fillEmpty(cheeseDirectory[i].ManufacturerNameFr, cheeseDirectory[i].ManufacturerNameEn, true);
        manufacturerWebsite = fillEmpty(cheeseDirectory[i].WebSiteFr, cheeseDirectory[i].WebSiteEn, true);
        manufacturingType = fillEmpty(cheeseDirectory[i].ManufacturingTypeFr, cheeseDirectory[i].ManufacturingTypeEn, true);

        cheeseName = fillEmpty(cheeseDirectory[i].CheeseNameFr, cheeseDirectory[i].CheeseNameEn, true);
        particularities = fillEmpty(cheeseDirectory[i].ParticularitiesFr, cheeseDirectory[i].ParticularitiesEn, true);
        flavour = fillEmpty(cheeseDirectory[i].FlavourFr, cheeseDirectory[i].FlavourEn, true);
        characteristics = fillEmpty(cheeseDirectory[i].CharacteristicsFr, cheeseDirectory[i].CharacteristicsEn, true);
        ripening = fillEmpty(cheeseDirectory[i].RipeningFr, cheeseDirectory[i].RipeningEn, true);
        rindType = fillEmpty(cheeseDirectory[i].RindTypeFr, cheeseDirectory[i].RindTypeEn, true);
    }

    // Display the information
    document.getElementById("cheeseNameHeading").innerText = cheeseName;
    document.getElementById("particularities").innerText = particularities;
    document.getElementById("flavour").innerText = flavour;
    document.getElementById("characteristics").innerText = characteristics;
    document.getElementById("ripening").innerText = ripening;
    document.getElementById("rindType").innerText = rindType;

    // Rows
    manufacturerTable.insertRow().innerHTML =
        "<tr>" +
        "<td> " + manufacturerName + "</td > " +
        "<td>" + cheeseDirectory[i].ManufacturerProvCode + "</td>" +
        "<td>" + manufacturingType + "</td>" +
        "<td>" + manufacturerWebsite + "</td>" +
        "</tr>";
} // end of viewDetails()


// Respond to a row click
function showRowDetails() {
    let chosenRow = window.event.target.closest('tr').cells[0].innerText; // cheese name
    viewDetails(chosenRow);
} // end of showRowDetails

// Respond to clicking a category
// When a category is selected, change its colour
function changeCategories() {
    let clickedCategory = window.event.target.closest('th').innerText;

    // Reset all the colours
    firmCheese.style['border-bottom'] = "";
    freshCheese.style['border-bottom'] = "";
    hardCheese.style['border-bottom'] = "";
    semiSoftCheese.style['border-bottom'] = "";
    softCheese.style['border-bottom'] = "";
    veinedCheese.style['border-bottom'] = "";
    uncategorized.style['border-bottom'] = "";
    document.getElementById("numPageDiv").style.display = "block";
    searchBox.value = "";

    let currentLanguage = getCurrentLanguage();

    if (clickedCategory === firmCheese.innerText) {
        firmCheese.style['border-bottom'] = "3px solid #5560ff";
        fetchData(firmCheese.innerText, currentLanguage);

    } else if (clickedCategory === freshCheese.innerText) {
        freshCheese.style['border-bottom'] = "3px solid #5560ff";
        fetchData(freshCheese.innerText, currentLanguage);

    } else if (clickedCategory === hardCheese.innerText) {
        hardCheese.style['border-bottom'] = "3px solid #5560ff";
        fetchData(hardCheese.innerText, currentLanguage);

    } else if (clickedCategory === semiSoftCheese.innerText) {
        semiSoftCheese.style['border-bottom'] = "3px solid #5560ff";
        fetchData(semiSoftCheese.innerText, currentLanguage);

    } else if (clickedCategory === softCheese.innerText) {
        softCheese.style['border-bottom'] = "3px solid #5560ff";
        fetchData(softCheese.innerText, currentLanguage);

    } else if (clickedCategory === veinedCheese.innerText) {
        veinedCheese.style['border-bottom'] = "3px solid #5560ff";
        fetchData(veinedCheese.innerText, currentLanguage);

    } else if (clickedCategory === uncategorized.innerText) {
        uncategorized.style['border-bottom'] = "3px solid #5560ff";
        fetchData("", currentLanguage);
    }
} // end of changeCategories()

// Add the cheese data to the table
// Only show a cheese name, fat content percentange, moisture percentage, organic, and information about milk
// searchTerm is an optional parameter
function populateTable(searchTerm = "noSearch") {
    let pageRange = calculatePageRange(document.getElementById("searchNum").value);

    mainTableBody.innerHTML = "";

    // If a user searches an item, display all the items that matches the item
    // Ignore the rowsPerPage
    if (searchTerm !== "noSearch") {
        pageRange.startFrom = 0;
        pageRange.upTo = cheeseDirectory.length;
    }

    for (var i = pageRange.startFrom; i < pageRange.upTo; i++) {

        let cheeseName = fillEmpty(cheeseDirectory[i].CheeseNameEn, cheeseDirectory[i].CheeseNameFr, false);
        let milkType = fillEmpty(cheeseDirectory[i].MilkTypeEn, cheeseDirectory[i].MilkTypeFr, false);
        let milkTreatmentType = fillEmpty(cheeseDirectory[i].MilkTreatmentTypeEn, cheeseDirectory[i].MilkTreatmentTypeFr, false);

        if (getCurrentLanguage() === "french") {
            cheeseName = fillEmpty(cheeseDirectory[i].CheeseNameFr, cheeseDirectory[i].CheeseNameEn, false);
            milkType = fillEmpty(cheeseDirectory[i].MilkTypeFr, cheeseDirectory[i].MilkTypeEn);
            milkTreatmentType = fillEmpty(cheeseDirectory[i].MilkTreatmentTypeFr, cheeseDirectory[i].MilkTreatmentTypeEn, false);
        }
        let organicTrue = "X";
        if (cheeseDirectory[i].Organic === "1") { // true
            organicTrue = "&#x02713";
        } else if (cheeseDirectory[i].Organic === "") {
            organicTrue = "";
        }

        if (searchTerm !== "noSearch") { // Search an item
            if (cheeseName.toLowerCase().includes(searchTerm.toLowerCase())) {
                mainTableBody.insertRow().innerHTML =
                    "<tr>" +
                    "<td> " + cheeseName + "</td> " +
                    "<td> " + cheeseDirectory[i].FatContentPercent + "</td>" +
                    "<td> " + cheeseDirectory[i].MoisturePercent + "</td>" +
                    "<td> " + organicTrue + "</td>" +
                    "<td> " + milkType + "</td>" +
                    "<td> " + milkTreatmentType + "</td>" +
                    "</tr>";
            }
        } else { // When the search box is not used 
            mainTableBody.insertRow().innerHTML =
                "<tr>" +
                "<td> " + cheeseName + "</td > " +
                "<td> " + cheeseDirectory[i].FatContentPercent + "</td>" +
                "<td> " + cheeseDirectory[i].MoisturePercent + "</td>" +
                "<td> " + organicTrue + "</td>" +
                "<td> " + milkType + "</td>" +
                "<td> " + milkTreatmentType + "</td>" +
                "</tr>";
        }
    }
} // end of populateTable()

// For unit testing
//module.exports = { fillEmpty, calculatePageRange, getCurrentLanguage }
