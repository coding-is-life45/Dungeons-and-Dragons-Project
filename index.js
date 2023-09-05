
function toggleFlip(card) {
    card.classList.toggle("flipped")
}




async function fetchClassData(className) {
    const response = await fetch(`https://www.dnd5eapi.co/api/classes/${className}`);
    const data = await response.json();
    return data;
}
async function fetchRaceData(raceName) {
    const response = await fetch(`https://www.dnd5eapi.co/api/races/${raceName}`);
    const data = await response.json();
    console.log(data.index);
    return data ;
}

async function fetchClassAbilities(className) {
    const response = await fetch(`https://www.dnd5eapi.co/api/classes/${className}/features`);
    const data = await response.json();
    const abilitiesMapping = {
        druid: ["Druidic", "Wild Shape", "Druid Circle", "Timeless Body", "Beast Spells", "Archdruid"],
        wizard: ["Spell Casting", "Spellbook", "Arcane Recovery", "Arcane Tradition"],
        rogue: ["Expertise", "Sneak Attack", "Roguish Archetype", "Evasion", "Stroke of Luck", "Reliable Talent"],
        monk: ["Martial Arts", "Monastic Tradition", "Deflect Missiles", "Slow Fall", "Empty Body", "Perfect Self"],
        barbarian: ["Rage", "Reckless Attack", "Danger Sense", "Brutal Critical", "Relentless Rage", "Primal Path"],
        ranger: ["Favored Enemy", " Natural Explorer", "Primeval Awareness", "Land's Stride", "Vanish", "Foe Slayer"]
    }
    return abilitiesMapping[className];

}

async function fetchRaceTraits(raceName) {
    const response = await fetch(`https://www.dnd5eapi.co/api/races/${raceName}/traits`);
    const data = await response.json();
    const traitsMapping = {
        dwarf: ["Darkvision", "Dwarven Resilience", "Tool Proficiency", "Stone Cunning", "Dwarven Combat Training"],
        elf: ["Darkvision", "Keen Senses", "Fey Ancestry", "Trance", "Subrace"],
        halfling: ["Lucky", "Brave", "Halfling Nimbleness", "Subrace"],
        human: ["There's nothing special about humans"],
        dragonborn: ["Draconic Ancestry", "Breath Weapon", "Damage Resistance"],
        gnome: ["Darkvision", "Gnome Cunning", "Subrace"]
    }
    return traitsMapping[raceName];


}


function generateClassCardHtml(classData, classAbilities) {


    const leftAbilities = classAbilities.slice(0, Math.ceil(classAbilities.length / 2));
    const rightAbilities = classAbilities.slice(Math.ceil(classAbilities.length / 2));

    const leftAbilitiesHtml = leftAbilities.map(ability => `<li class="class__skill">${ability}</li>`).join(' ');
    const rightAbilitiesHtml = rightAbilities.map(ability => `<li class="class__skill">${ability}</li>`).join('');
    return `
      <div class="card card__front" onclick="toggleFlip(this)">
        <div class="card__class-name">${classData.name}</div>
        <figure class="card__img--wrapper"><img src="card_template.png" class="card__img" alt="" /></figure>
        <div class="card__info"></div>
        <div class="card__back--wrapper">
          <div class="card__back--top"></div>
          <div class="card__back--bottom">
            <h3 class="class__title">${classData.name}</h3>
            <div class="class__skills--wrapper">
              <ul class="class__skills">
                <div class="class__skills--left">${leftAbilitiesHtml}</div>
                <div class="class__skills--right">${rightAbilitiesHtml}</div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
}

async function renderCards(type) {
    let cardsContainer = document.querySelector(" .cards");
    cardsContainer.innerHTML = '';

    if (type === "class") {
        const classes = ['druid', 'wizard', 'rogue', 'monk', 'barbarian', 'ranger']; // Add more class names here
        cardsContainer = document.querySelector('.cards');

        const classDataPromises = classes.map(className => fetchClassData(className));
        const classDataList = await Promise.all(classDataPromises);

        for (const classData of classDataList) {
            const classAbilities = await fetchClassAbilities(classData.index);
            const cardHtml = generateClassCardHtml(classData, classAbilities);
            cardsContainer.insertAdjacentHTML('beforeend', cardHtml);

        }
    } else if (type === "race") {
        const races = ["dwarf", "elf", "halfling", "human", "dragonborn", "gnome"];
        const raceDataPromises = races.map(raceName => fetchRaceData(raceName));
        const raceDataList = await Promise.all(raceDataPromises);

        for (const raceName of races) {
            const raceData = await fetchRaceData(raceName);
            const raceTraits = await fetchRaceTraits(raceName);
            const cardHtml = generateRaceCardHtml(raceData.name, raceTraits);
            cardsContainer.insertAdjacentHTML('beforeend', cardHtml);
        }
    }
}

function generateRaceCardHtml(raceData, raceTraits) {


    const leftTraits = raceTraits.slice(0, Math.ceil(raceTraits.length / 2));
    const rightTraits = raceTraits.slice(Math.ceil(raceTraits.length / 2));

    const leftTraitsHtml = leftTraits.map(trait => `<li class="class__skill">${trait}</li>`).join(' ');
    const rightTraitsHtml = rightTraits.map(trait => `<li class="class__skill">${trait}</li>`).join('');
    return `
      <div class="card card__front" onclick="toggleFlip(this)">
        <div class="card__class-name">${raceData}</div>
        <figure class="card__img--wrapper"><img src="card_template.png" class="card__img" alt="" /></figure>
        <div class="card__info"></div>
        <div class="card__back--wrapper">
          <div class="card__back--top"></div>
          <div class="card__back--bottom">
            <h3 class="class__title">${raceData}</h3>
            <div class="class__skills--wrapper">
              <ul class="class__skills">
                <div class="class__skills--left">${leftTraitsHtml}</div>
                <div class="class__skills--right">${rightTraitsHtml}</div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;
}




function handleFilterChange() {
    const filteredDropdown = document.getElementById("filter");
    filteredDropdown.addEventListener('change', () => {
        const selectedOption = filteredDropdown.value;
        if (selectedOption === "CLASSES") {
            renderCards("class");
        } else {
            renderCards("race");
        }
    })
    
}



handleFilterChange()
renderCards("class");
fetchRaceData("dwarf")



