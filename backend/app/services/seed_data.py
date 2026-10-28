from sqlalchemy.orm import Session
from backend.app.models.models import (
    Pesticide,
    OrganicAlternative,
    EducationalResource,
    RegionalAdvisory,
    User,
    FarmerCrop,
    FarmingActivity,
    Notification
)
from backend.app.core.security import hash_password

def seed_database(db: Session):
    # Check if database already seeded
    if db.query(Pesticide).first():
        return

    # 1. Verified Pesticides (CIBRC registered & approved standards)
    pesticides_data = [
        {
            "brand_name": "Chlorantraniliprole 18.5% SC (Coragen)",
            "technical_name": "Chlorantraniliprole 18.5% SC",
            "chemical_family": "Anthranilic diamide",
            "category": "Insecticide",
            "registered_crops": "Rice, Cotton, Sugarcane, Tomato, Cabbage, Chilli",
            "target_pests": "Stem Borer, Leaf Folder, American Bollworm, Diamond Back Moth, Fruit Borer",
            "label_dosage": "60 ml per acre (150 ml/ha)",
            "dilution_ratio": "0.3 ml to 0.4 ml per Litre of water",
            "application_guidance": "Foliar spray at early vegetative stage upon egg hatch or initial pest sighting. Ensure uniform coverage with high volume knapsack sprayer.",
            "safety_precautions": "Avoid spraying during peak bee foraging hours. Do not spray against the wind. Store locked away from food and animal feed.",
            "ppe_required": "Chemical resistant gloves, goggles, face shield/mask, full-sleeve apron and rubber boots.",
            "pre_harvest_interval_days": 14,
            "toxicity_band": "Green",
            "environmental_hazard": "Relatively low toxicity to beneficial insects, but toxic to aquatic invertebrates if sprayed near water bodies.",
            "source_reference": "Central Insecticides Board & Registration Committee (CIBRC), Govt of India"
        },
        {
            "brand_name": "Mancozeb 75% WP (Dithane M-45)",
            "technical_name": "Mancozeb 75% WP",
            "chemical_family": "Dithiocarbamate",
            "category": "Fungicide",
            "registered_crops": "Potato, Tomato, Wheat, Groundnut, Paddy, Apple, Grapes",
            "target_pests": "Late Blight, Early Blight, Brown Rust, Tikka Leaf Spot, Blast",
            "label_dosage": "600-800 g per acre (1.5 - 2.0 kg/ha)",
            "dilution_ratio": "2.0 g to 2.5 g per Litre of water",
            "application_guidance": "Preventive foliar spray before onset of cloudy/humid conditions favoring fungal spore germination. Repeat at 7-10 days interval if infection persists.",
            "safety_precautions": "Wash skin thoroughly with soap and water after application. Do not inhale dust or spray mist. Avoid contact with eyes.",
            "ppe_required": "N95 particulate respirator mask, rubber gloves, protective glasses, boots.",
            "pre_harvest_interval_days": 7,
            "toxicity_band": "Blue",
            "environmental_hazard": "Toxic to fish and aquatic fauna. Do not contaminate irrigation drains or ponds.",
            "source_reference": "CIBRC & ICAR-Directorate of Plant Protection, Quarantine and Storage (DPPQS)"
        },
        {
            "brand_name": "Imidacloprid 17.8% SL (Confidor)",
            "technical_name": "Imidacloprid 17.8% SL",
            "chemical_family": "Neonicotinoid",
            "category": "Insecticide",
            "registered_crops": "Cotton, Paddy, Chilli, Sugarcane, Mango, Okra",
            "target_pests": "Aphids, Jassids, Thrips, Brown Plant Hopper (BPH), Whitefly, Termites",
            "label_dosage": "40-50 ml per acre",
            "dilution_ratio": "0.25 ml to 0.3 ml per Litre of water",
            "application_guidance": "Systemic foliar spray for sucking pests when pest population exceeds economic threshold level (ETL). Also used as seedling dip.",
            "safety_precautions": "Strictly do NOT apply during crop flowering to prevent pollinator/honeybee poisoning. Never tank mix with strong alkaline chemicals.",
            "ppe_required": "Nitrile gloves, protective glasses, organic vapor face mask, full overalls.",
            "pre_harvest_interval_days": 21,
            "toxicity_band": "Yellow",
            "environmental_hazard": "Highly toxic to bees and pollinators. Persistent in soil. High leaching potential.",
            "source_reference": "CIBRC & ICAR Integrated Pest Management Portal"
        },
        {
            "brand_name": "Emamectin Benzoate 5% SG (Proclaim)",
            "technical_name": "Emamectin Benzoate 5% SG",
            "chemical_family": "Avermectin (Microbial origin)",
            "category": "Insecticide",
            "registered_crops": "Cotton, Tomato, Okra, Cabbage, Chilli, Gram",
            "target_pests": "Helicoverpa armigera (Bollworm/Fruit Borer), Diamond Back Moth, Pod Borer, Spodoptera",
            "label_dosage": "80-100 g per acre",
            "dilution_ratio": "0.5 g per Litre of water",
            "application_guidance": "Spray during evening hours when caterpillars become active. Penetrates leaf tissues via translaminar action within hours.",
            "safety_precautions": "Keep livestock away from treated area for at least 3 days. Do not breathe spray cloud.",
            "ppe_required": "Protective face shield, rubber gloves, long trousers, protective boots.",
            "pre_harvest_interval_days": 3,
            "toxicity_band": "Blue",
            "environmental_hazard": "Toxic to bees directly exposed to spray, moderate aquatic toxicity.",
            "source_reference": "CIBRC Approved Product Schedule"
        },
        {
            "brand_name": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC (Amistar Top)",
            "technical_name": "Azoxystrobin + Difenoconazole SC",
            "chemical_family": "Strobilurin + Triazole",
            "category": "Fungicide",
            "registered_crops": "Rice, Tomato, Chilli, Maize, Wheat",
            "target_pests": "Sheath Blight, Blast, Anthracnose, Powdery Mildew, Leaf Spot",
            "label_dosage": "200 ml per acre",
            "dilution_ratio": "1.0 ml per Litre of water",
            "application_guidance": "Dual action systemic fungicide offering both preventive and curative control. Apply at the very first appearance of lesions.",
            "safety_precautions": "Do not exceed recommended dose to avoid fungal resistance development. Alternate with multisite fungicides like Mancozeb or Copper.",
            "ppe_required": "Chemical goggles, nitrile gloves, full coverall, waterproof boots.",
            "pre_harvest_interval_days": 10,
            "toxicity_band": "Blue",
            "environmental_hazard": "Very toxic to aquatic life with long-lasting effects. Keep away from water channels.",
            "source_reference": "CIBRC Registered Fungicide Matrix"
        },
        {
            "brand_name": "Copper Oxychloride 50% WP (Blitox)",
            "technical_name": "Copper Oxychloride 50% WP",
            "chemical_family": "Inorganic Copper",
            "category": "Fungicide",
            "registered_crops": "Potato, Tomato, Citrus, Coffee, Tea, Cardamom, Grapes",
            "target_pests": "Bacterial Blight, Downy Mildew, Rust, Citrus Canker, Black Rot",
            "label_dosage": "1.0 kg per acre",
            "dilution_ratio": "2.5 g to 3.0 g per Litre of water",
            "application_guidance": "Broad-spectrum contact bactericide and fungicide. Maintain thorough coverage on both upper and lower leaf surfaces.",
            "safety_precautions": "Wear dust mask when opening packets and mixing. Avoid skin contact as copper salts can cause severe irritation.",
            "ppe_required": "Dust mask, rubber gloves, apron, protective goggles.",
            "pre_harvest_interval_days": 5,
            "toxicity_band": "Blue",
            "environmental_hazard": "Can accumulate in topsoil with excessive continuous use. Toxic to aquatic organisms.",
            "source_reference": "ICAR-Central Potato Research Institute (CPRI) Guidelines"
        },
        {
            "brand_name": "Thiamethoxam 25% WG (Actara)",
            "technical_name": "Thiamethoxam 25% WG",
            "chemical_family": "Neonicotinoid",
            "category": "Insecticide",
            "registered_crops": "Rice, Cotton, Mustard, Wheat, Tomato, Mango",
            "target_pests": "Stem Borer, Green Leaf Hopper, Whitefly, Mustard Aphid, Mosquito Bug",
            "label_dosage": "40-80 g per acre",
            "dilution_ratio": "0.3 g to 0.5 g per Litre of water",
            "application_guidance": "Fast acting broad-spectrum systemic insecticide. Rapidly taken up by plant roots and foliage.",
            "safety_precautions": "Prohibited near flowering beehives. Do not spray during windy conditions.",
            "ppe_required": "Nitrile gloves, face mask, eye protection.",
            "pre_harvest_interval_days": 14,
            "toxicity_band": "Yellow",
            "environmental_hazard": "High threat to pollinating insect colonies. Regulated usage.",
            "source_reference": "CIBRC Pest Management Gazette"
        }
    ]

    for p in pesticides_data:
        db.add(Pesticide(**p))

    # 2. Verified Organic Alternatives (NCOF, ICAR & Permaculture verified)
    organic_data = [
        {
            "name": "Neem Oil 10,000 ppm (Azadirachtin)",
            "category": "Botanical Extract",
            "target_pests": "Aphids, Whiteflies, Thrips, Leafminers, Early Stage Caterpillars, Spider Mites",
            "suitable_crops": "All Vegetables, Pulses, Paddy, Cotton, Fruits, Spices",
            "preparation_method": "Cold-pressed pure neem kernel oil standardized to 1% Azadirachtin. Emulsify 5 ml of neem oil with 1 ml of mild liquid soap or Khadi soap solution per litre of water to ensure smooth dispersion without oil separation.",
            "application_method": "Foliar spray early in the morning (6-8 AM) or late afternoon (4-6 PM). Azadirachtin acts as an anti-feedant, repellent, and insect growth regulator (IGR). Apply every 7-10 days as a preventive barrier.",
            "benefits": "Completely eco-friendly, zero toxic chemical residues, safe for earthworms and non-target beneficial predators like ladybugs and lacewings. No pre-harvest interval needed.",
            "limitations": "Slow knockdown compared to synthetic poisons; acts within 48-72 hours by disrupting moulting and feeding. Requires reapplication after rainfall.",
            "cost_level": "Low",
            "source_reference": "National Centre of Organic and Natural Farming (NCNF) & ICAR-IIPR"
        },
        {
            "name": "Jeevamrutha (Bio-Enhancer & Soil Inoculant)",
            "category": "Soil Health & Bio-Stimulant",
            "target_pests": "Soil-borne fungal pathogens (Fusarium, Rhizoctonia, Pythium), Root Rot, Seedling Damping-off",
            "suitable_crops": "All Agricultural and Horticultural Crops, Cereals, Pulses, Plantation Crops",
            "preparation_method": "Mix 10 kg native cow dung, 10 litres cow urine, 2 kg jaggery, 2 kg gram/pulse flour (besan), and a handful of fertile virgin soil from a banyan tree or field bund into 200 litres of water in a shade barrel. Stir clockwise twice daily for 4-5 days to ferment.",
            "application_method": "Apply 200 litres per acre through irrigation water, drip system, or soil drenching around plant root zone twice a month. Can also be filtered through muslin cloth and sprayed at 10% dilution on foliage.",
            "benefits": "Multiplies billions of beneficial soil microorganisms, activates earthworm activity, converts insoluble minerals into plant-absorbable forms, suppresses soil pathogens.",
            "limitations": "Must be used within 7-10 days of fermentation. Labor required for batch preparation.",
            "cost_level": "Very Low",
            "source_reference": "National Centre for Organic Farming (NCOF) Technical Bulletin & Subhash Palekar Natural Farming"
        },
        {
            "name": "Trichoderma viride 1.5% WP (Bio-Fungicide)",
            "category": "Bio-pesticide",
            "target_pests": "Root Rot, Collar Rot, Stem Rot, Wilt, Damping Off, Blight (Fusarium, Pythium, Sclerotium)",
            "suitable_crops": "Tomato, Potato, Chilli, Pulses, Cotton, Groundnut, Ginger, Turmeric",
            "preparation_method": "Formulated antagonistic fungal spore culture (CFU 2x10^6 /g minimum). Mix 1 kg Trichoderma with 100 kg well-decomposed Farm Yard Manure (FYM), cover with wet gunny bag in shade for 7 days to enrich spores.",
            "application_method": "Seed treatment (10 g/kg seed), seedling root dip (100 g in 10 L water), or broadcast the enriched FYM into soil before sowing or near plant bases during inter-cultivation.",
            "benefits": "Parasitizes pathogenic fungi through mycoparasitism and secretion of chitinase enzymes. Stimulates root growth and induced systemic resistance (ISR). Permanent soil establishment.",
            "limitations": "Do NOT apply chemical fungicides or copper-based sprays within 10 days before or after application. Sensitive to extreme soil dryness.",
            "cost_level": "Low",
            "source_reference": "ICAR-Indian Institute of Horticultural Research (IIHR), Bengaluru"
        },
        {
            "name": "Beauveria bassiana 1.15% WP (Entomopathogenic Fungus)",
            "category": "Bio-pesticide",
            "target_pests": "Whiteflies, Mealybugs, Thrips, Stem Borer, Cutworms, Helicoverpa caterpillars, Weevils",
            "suitable_crops": "Cotton, Rice, Sugarcane, Tomato, Brinjal, Cabbage, Chilli, Papaya",
            "preparation_method": "Mix 5 g of commercial Beauveria bassiana powder per litre of clean water. Add 0.5 ml of mild surfactant or milk to enhance spore stickiness on pest cuticle.",
            "application_method": "Spray in high humidity or evening hours. Fungal spores attach to the insect cuticle, germinate, penetrate the insect body, and kill the host within 3 to 5 days, producing white muscardine symptom.",
            "benefits": "Self-perpetuating in the field through secondary spore cycles. Target-specific with zero risk of chemical poisoning for farm workers.",
            "limitations": "Requires relative humidity above 70% and temperatures below 32°C for optimal spore germination.",
            "cost_level": "Low",
            "source_reference": "ICAR-National Bureau of Agricultural Insect Resources (NBAIR), Bengaluru"
        },
        {
            "name": "Yellow & Blue Sticky Traps + Pheromone Traps",
            "category": "Physical & Cultural Control",
            "target_pests": "Yellow Traps: Whiteflies, Aphids, Leafminers. Blue Traps: Thrips. Pheromone Traps: Fruit Borer, Fall Armyworm, Leaf Folder",
            "suitable_crops": "Tomato, Chilli, Cotton, Maize, Rice, Brinjal, Capsicum, Cucurbits",
            "preparation_method": "Yellow and blue PVC / plastic sheets (15x30 cm) coated with non-drying entomological glue or castor oil. Funnel/Delta pheromone lures impregnated with species-specific female sex pheromone septa.",
            "application_method": "Install 15-20 sticky traps per acre at 1 foot above crop canopy. Install 5-8 pheromone traps per acre for ETL monitoring and 12-15 traps for mass trapping of male moths.",
            "benefits": "24/7 continuous pest catch without chemical input. Provides early warning alert for pest influx before severe crop damage occurs.",
            "limitations": "Traps only flying adults; does not directly kill subterranean larvae or eggs. Sticky sheets need replacing when dust/insects cover 70% surface.",
            "cost_level": "Very Low",
            "source_reference": "ICAR Integrated Pest Management (IPM) Technical Handbook"
        },
        {
            "name": "Dashaparni Kashayam (10-Leaf Botanical Decoction)",
            "category": "Botanical Extract",
            "target_pests": "Chewing and Sucking Pests, Leaf Folders, Caterpillars, Stem Borers, Fungal Mildews",
            "suitable_crops": "Rice, Wheat, Pulses, Vegetables, Cotton, Spices",
            "preparation_method": "Crush 2 kg leaves each of Neem, Karanja, Custard apple, Papaya, Castor, Datura, Calotropis (Arka), Guava, Lantana, and Pomegranate. Ferment with 20 L cow urine and 2 kg cow dung in 200 L water for 30-40 days.",
            "application_method": "Filter the liquid extract and spray at 2-3% dilution (200-300 ml in 10 L water) across foliage every 15 days.",
            "benefits": "Combines diverse alkaloids (azadirachtin, pongamol, ricinine, calotropin) delivering potent anti-feedant and repellent action. Pests cannot develop resistance.",
            "limitations": "Preparation takes 30 days fermentation; needs planned batching.",
            "cost_level": "Very Low",
            "source_reference": "NCOF Organic Farming Package of Practices"
        },
        {
            "name": "Panchagavya (Organic Growth Promoter & Immunity Booster)",
            "category": "Bio-Stimulant & Organic Defense",
            "target_pests": "Increases plant systemic immunity against bacterial and viral infections; repels piercing pests",
            "suitable_crops": "All Vegetables, Paddy, Banana, Mango, Spices, Flowers",
            "preparation_method": "Combine five cow products: 5 kg cow dung, 3 litres cow urine, 2 litres cow milk, 2 litres cow curd, and 1 kg ghee. Add 3 litres tender coconut water, 1 kg jaggery, and 12 ripe bananas. Ferment for 21 days with daily stirring.",
            "application_method": "Foliar spray at 3% concentration (30 ml per litre of water) at vegetative, flowering, and fruit-set stages.",
            "benefits": "Contains auxins, gibberellins, lactic acid bacteria, and actinomycetes. Dramatically improves chlorophyll content, fruit size, aroma, and shelf-life.",
            "limitations": "Must be strained carefully to avoid clogging spray nozzles. Odor during spraying.",
            "cost_level": "Low",
            "source_reference": "Tamil Nadu Agricultural University (TNAU) Organic Agronomy Division"
        }
    ]

    for o in organic_data:
        db.add(OrganicAlternative(**o))

    # 3. Educational Resources
    edu_data = [
        {
            "title": "A Beginner's Guide to Certified Organic Farming in India",
            "category": "Organic Basics",
            "read_time": "6 min read",
            "summary": "Step-by-step roadmap to transitioning from chemical farming to Jaivik Bharat organic certification, soil restructuring, and market linkage.",
            "content_markdown": """# A Beginner's Guide to Certified Organic Farming in India

### 1. Understanding the Organic Paradigm
Organic farming is not merely the absence of synthetic fertilizers and pesticides; it is a holistic production management system that promotes and enhances agro-ecosystem health, including biodiversity, biological cycles, and soil biological activity.

### 2. The Conversion Period
- **Annual crops (vegetables, grains):** 24 months conversion period before harvests can be certified organic.
- **Perennial crops (orchards, plantations):** 36 months conversion period.
- During conversion, crops can be marketed as 'In-Conversion' under the Participatory Guarantee System of India (PGS-India).

### 3. Core Organic Principles
1. **Soil Health First:** Feed the soil micro-biome using compost, green manuring (*Sesbania*, *Crotalaria*), and crop rotation with nitrogen-fixing pulses.
2. **Biodiversity as Pest Control:** Intercrop with marigold (*Tagetes*) to deter nematodes and attract beneficial predatory wasps.
3. **No Synthetic Inputs:** Zero synthetic urea, DAP, or chemical organophosphates.

### 4. Certification Pathways in India
- **PGS-India (Participatory Guarantee System):** Farmer-group based, low-cost certification administered by the Ministry of Agriculture.
- **NPOP (National Programme for Organic Production):** Third-party accredited certification essential for export markets, governed by APEDA.

### 5. Economic Advantages
- 20% to 40% reduction in cultivation input costs.
- 15% to 50% premium price realization through Farmer Producer Organizations (FPOs) and direct farm-to-table consumer models.""",
            "author": "Dr. Ramesh Patil, Organic Farming Specialist",
            "tags": "Certification, PGS-India, Conversion, Soil Health, NPOP",
            "source_url": "https://pgsindia-ncof.gov.in"
        },
        {
            "title": "Mastering Fast Aerobic Composting & In-Situ Farm Waste Recycling",
            "category": "Composting",
            "read_time": "5 min read",
            "summary": "How to convert crop residues, straw, and cow manure into black gold organic compost in 45-60 days using optimal Carbon-to-Nitrogen ratios.",
            "content_markdown": """# Mastering Fast Aerobic Composting

### Why Compost on Farm?
Burning crop stubble destroys soil organic carbon and releases greenhouse gases. Aerobic composting transforms agricultural residues into stable, nutrient-dense humus rich in beneficial microflora.

### The Science: C:N Ratio
Microbes require carbon for energy and nitrogen for protein synthesis. The ideal Carbon-to-Nitrogen ratio is **30:1**.
- **Brown Materials (Carbon Rich):** Dry straw, dried leaves, sawdust, rice husk, shredded stalks.
- **Green Materials (Nitrogen Rich):** Fresh cow dung, green grass clippings, leguminous residues, vegetable waste.

### The Layering Recipe (Heap Method)
1. **Base Layer (15 cm):** Coarse dry twigs or stalk material for aeration drainage.
2. **Brown Layer (20 cm):** Dry straw or shredded crop residue.
3. **Green Layer (10 cm):** Fresh cow dung slurry or legume foliage.
4. **Bio-Inoculant:** Sprinkle waste decomposer (WDC) or *Trichoderma* culture to accelerate lignocellulose breakdown.
5. Repeat layers up to 1.5 meters height.

### Temperature & Moisture Control
- Maintain moisture at **50-60%** (a handful squeezed should form a ball with no water dripping).
- Internal pile temperature should reach **55°C to 65°C** within 7 days, destroying weed seeds and plant pathogen spores.
- Turn the pile on Day 15, Day 30, and Day 45 to inject oxygen. Rich, dark, earth-scented compost will be ready by Day 60.""",
            "author": "KrishiRakshak Agronomy Research Team",
            "tags": "Composting, Soil Carbon, Waste Decomposer, Microbes",
            "source_url": "ICAR-Indian Institute of Soil Science (IISS), Bhopal"
        },
        {
            "title": "Vermicomposting: Multiplying Earthworm Gold on Small Farms",
            "category": "Vermicomposting",
            "read_time": "7 min read",
            "summary": "Complete instructions on constructing low-cost vermicompost beds using Eisenia fetida earthworms to generate premium vermicast and vermiwash.",
            "content_markdown": """# Vermicomposting: Multiplying Earthworm Gold

### Earthworm Species Selection
Use epigeic surface-dwelling earthworms rather than native deep-burrowing species:
- **Eisenia fetida (Red Wigglers):** High voracity, thrives across wide temperature ranges (15°C - 35°C), multiplies rapidly.
- **Eudrilus eugeniae (African Nightcrawler):** High biomass production, well suited for southern Indian tropical conditions.

### Setting Up a Low-Cost Bed
- **Dimensions:** 10 feet long, 3 feet wide, 2 feet high. Provide a shaded thatched roof to prevent direct sun and predatory birds.
- **Bedding:** Place 3 inches of coconut coir pith or chopped paddy straw at the base.
- **Pre-digested Feed:** Mix cow dung with crop waste and let it cool for 10-14 days. Never add fresh burning-hot dung directly to worms!
- **Stocking Rate:** Introduce 1 to 2 kg of earthworms per 100 kg of pre-digested organic matter.

### Moisture and Protection
- Sprinkle water every 2 days to maintain 60% moisture.
- Create an ant barrier water canal around the base of the vermicompost shed.

### Harvesting Vermicompost & Vermiwash
- Within 45 to 60 days, upper layers transform into loose, granular, tea-ground-like castings.
- Stop watering 3 days before harvesting so worms migrate downwards.
- Scrape top granular layers and sieve through a 3 mm screen.
- Collect liquid drainage (**Vermiwash**) from the bed tap. Dilute vermiwash 1:10 with water as a foliar spray to impart disease resistance and vegetative vigor.""",
            "author": "Dr. S. K. Narayana, Vermitechnologist",
            "tags": "Eisenia fetida, Vermicast, Vermiwash, Organic Fertilizer",
            "source_url": "Krishi Vigyan Kendra (KVK) Extension Notes"
        },
        {
            "title": "Integrated Pest Management (IPM): The Golden Middle Path",
            "category": "IPM",
            "read_time": "8 min read",
            "summary": "How to combine cultural, biological, and minimum chemical safety thresholds (ETL) to protect crops while saving money and nature.",
            "content_markdown": """# Integrated Pest Management (IPM): The Golden Middle Path

### What is IPM?
Integrated Pest Management is an ecosystem approach to crop production that combines different management strategies to grow healthy crops and minimize the use of pesticides.

### The IPM Pyramid
1. **Foundation: Cultural & Preventive Controls**
   - Clean field sanitation, removing crop residues and weed hosts.
   - Deep summer ploughing to expose pupae and nematodes to scorching sun.
   - Crop rotation with non-host species to break pest life cycles.
   - Trap crops: Planting castor on cotton borders to intercept *Spodoptera*, marigold in tomato fields to lure fruit borer and trap nematodes.

2. **Second Tier: Mechanical & Physical Controls**
   - Hand-picking egg masses and gregarious young caterpillars.
   - Installing bird perches (15-20 per acre) to attract insectivorous birds like Drongo and Indian Roller.
   - Pheromone traps and yellow/blue sticky cards for population tracking.

3. **Third Tier: Biological Controls**
   - Conserving native natural enemies: Spiders, Ladybird beetles, Chrysoperla, Syrphid flies.
   - Inundative releases of *Trichogramma chilonis* egg parasitoids (50,000 eggs/acre).
   - Bio-pesticides like *Bacillus thuringiensis* (Bt), *Beauveria bassiana*, and Neem kernel extracts.

4. **Last Resort: Judicious Chemical Application**
   - Spray synthetic pesticides ONLY when pest density breaches the **Economic Threshold Level (ETL)**.
   - Choose green-triangle targeted molecules over broad-spectrum cocktails.
   - Never exceed the recommended dilution ratio and observe the Pre-Harvest Interval (PHI).""",
            "author": "KrishiRakshak Entomology Division",
            "tags": "IPM, Economic Threshold Level, Trap Crops, Biological Control",
            "source_url": "ICAR-National Research Centre for Integrated Pest Management (NCIPM), New Delhi"
        },
        {
            "title": "Soil Organic Matter: Restoring the Microbiome for Drought Resilience",
            "category": "Soil Health",
            "read_time": "6 min read",
            "summary": "Learn how elevating soil organic carbon from 0.4% to 1.0% doubles water retention capacity and cuts fertilizer requirements by half.",
            "content_markdown": """# Soil Organic Matter: Restoring the Microbiome for Drought Resilience

### The Critical State of Indian Soils
Over 60% of arable land in India suffers from low Soil Organic Carbon (SOC < 0.5%). Intensive chemical fertilization without organic replenishment has burned through organic matter, resulting in hardpan formation, low water infiltration, and micronutrient deficiencies (Zinc, Boron, Iron).

### Benefits of Increasing Soil Organic Carbon
- **Massive Water Retention:** Every 1% increase in soil organic matter enables soil to hold approximately 20,000 gallons of additional water per acre, buffering crops against prolonged dry spells.
- **Cation Exchange Capacity (CEC):** Humus holds positively charged nutrient ions (K+, Ca++, Mg++, NH4+) preventing heavy fertilizer leaching into groundwater.
- **Mycorrhizal Networks:** Arbuscular Mycorrhizal Fungi (AMF) form symbiotic hyphal networks extending root absorption surfaces by up to 700%.

### Actionable Practices to Boost SOC
1. **Green Manuring:** Grow *Daincha* (*Sesbania aculeata*) or Sunnhemp (*Crotalaria juncea*) for 45 days and incorporate it into the soil before flowering. This adds 15-20 tonnes of green biomass and 60-80 kg Nitrogen per hectare.
2. **Mulching:** Keep soil covered year-round with crop residues or live cover crops to keep soil temperatures below 35°C, protecting delicate mycorrhizae.
3. **Reduced Tillage:** Minimize deep inversion ploughing to prevent carbon oxidation into atmospheric CO2.""",
            "author": "Prof. M. Venkataramana, Soil Scientist",
            "tags": "Soil Carbon, Green Manure, Mycorrhizae, Water Retention",
            "source_url": "ICAR-Indian Institute of Soil and Water Conservation (IISWC)"
        }
    ]

    for ed in edu_data:
        db.add(EducationalResource(**ed))

    # 4. Regional Advisories
    regional_data = [
        {
            "state": "Karnataka",
            "district": "Bengaluru Rural",
            "season": "Kharif",
            "crop": "Ragi (Finger Millet)",
            "recommendation": "Sow blast-resistant varieties like GPU-28 or ML-365. Treat seeds with Pseudomonas fluorescens @ 10 g/kg seed before sowing. Incorporate 5 tonnes of FYM per acre. For weed management, pass inter-cultivation blade harrow at 20 and 35 days after sowing.",
            "pest_risks": "Finger Millet Blast (Pyricularia grisea), Stem Borer, Aphids during dry spells.",
            "govt_resources": "Karnataka Raitha Samparka Kendra (RSK) & UAS Bengaluru Farmer Helpline 1800-425-3553"
        },
        {
            "state": "Karnataka",
            "district": "Bengaluru Rural",
            "season": "Rabi",
            "crop": "Tomato",
            "recommendation": "Erect nylon insect-proof net nurseries (40-mesh) to prevent early whitefly transmission of Tomato Leaf Curl Virus (ToLCV). Apply mulching sheets to conserve moisture. Spray Neem oil 10,000 ppm @ 2 ml/L preventively at 15-day intervals.",
            "pest_risks": "Early Blight (Alternaria solani), Fruit Borer (Helicoverpa armigera), Whitefly vector.",
            "govt_resources": "ICAR-IIHR Hessarghatta Tomato Advisory Service"
        },
        {
            "state": "Maharashtra",
            "district": "Pune",
            "season": "Kharif",
            "crop": "Soybean",
            "recommendation": "Inoculate seeds with Bradyrhizobium japonicum and PSB culture @ 250 g each per 10 kg seeds. Install 5 pheromone traps per acre for Spodoptera litura monitoring. Avoid water stagnation during continuous monsoon showers.",
            "pest_risks": "Girdle Beetle, Tobacco Caterpillar (Spodoptera), Yellow Mosaic Virus.",
            "govt_resources": "MahaAgri Farmer Advisory & KVK Narayangaon Portal"
        },
        {
            "state": "Punjab",
            "district": "Ludhiana",
            "season": "Rabi",
            "crop": "Wheat",
            "recommendation": "Adopt zero-tillage Happy Seeder technology to manage paddy stubble without burning. Monitor weekly for Yellow Rust (Puccinia striiformis) stripes on flag leaves. Apply light irrigation during the milking stage if temperatures rise abruptly.",
            "pest_risks": "Yellow Rust, Karnal Bunt, Pink Stem Borer.",
            "govt_resources": "Punjab Agricultural University (PAU) Kisan Mela Advisory"
        },
        {
            "state": "Uttar Pradesh",
            "district": "Varanasi",
            "season": "Kharif",
            "crop": "Paddy (Rice)",
            "recommendation": "Follow System of Rice Intensification (SRI) or Alternate Wetting and Drying (AWD) to economize water. Install bird perches for natural insect predation. Apply Trichoderma-enriched FYM at final puddling.",
            "pest_risks": "Bacterial Leaf Blight (BLB), Brown Plant Hopper (BPH), Stem Borer.",
            "govt_resources": "UP Krishi Vibhag & BHU Agricultural Advisory Wing"
        },
        {
            "state": "Andhra Pradesh",
            "district": "Guntur",
            "season": "Kharif",
            "crop": "Chilli",
            "recommendation": "Erect border crop of 2-3 rows of maize/sorghum to barrier against invasive thrips (Thrips parvispinus). Install 30 blue sticky traps per acre at 1 ft above canopy. Spray Lecanicillium lecanii bio-fungicide @ 5 g/L during humid evenings.",
            "pest_risks": "Black Thrips (Thrips parvispinus), Anthracnose/Die-back, Geminivirus.",
            "govt_resources": "ANGRAU Chilli Research Station, Lam, Guntur"
        }
    ]

    for reg in regional_data:
        db.add(RegionalAdvisory(**reg))

    # 5. Default Demonstration Farmer User with realistic sample farm data
    demo_user = User(
        full_name="Vignesh",
        email="farmer@krishirakshak.in",
        mobile="+91 98765 43210",
        password_hash=hash_password("Kisan@2026"),
        state="Karnataka",
        district="Bengaluru Rural",
        preferred_language="en"
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)

    # Add sample crops for demo user
    sample_crops = [
        FarmerCrop(
            user_id=demo_user.id,
            crop_name="Tomato",
            variety="Arka Rakshak (IIHR F1 Hybrid)",
            farming_type="IPM",
            farm_area_acres=1.5,
            sowing_date="2026-09-15",
            stage="Flowering",
            notes="Drip irrigation installed. Mulched with silver-black polyethylene. Looking for leaf spot protection."
        ),
        FarmerCrop(
            user_id=demo_user.id,
            crop_name="Finger Millet (Ragi)",
            variety="ML-365",
            farming_type="Organic",
            farm_area_acres=2.0,
            sowing_date="2026-08-20",
            stage="Fruiting",
            notes="Treated with Jeevamrutha every 15 days. Clean crop with zero synthetic chemicals."
        ),
        FarmerCrop(
            user_id=demo_user.id,
            crop_name="Chilli",
            variety="Byadagi Kaddi",
            farming_type="Conventional",
            farm_area_acres=0.75,
            sowing_date="2026-09-28",
            stage="Vegetative",
            notes="Monitoring closely for thrips and leaf curl symptoms."
        )
    ]
    for sc in sample_crops:
        db.add(sc)

    # Add sample farming activities
    sample_activities = [
        FarmingActivity(
            user_id=demo_user.id,
            crop_name="Tomato",
            activity_date="2026-10-20",
            activity_type="Spraying",
            pest_disease="Early Blight Prevention",
            product_used="Neem Oil 10,000 ppm",
            quantity="500 ml in 150 L water",
            is_organic=True,
            cost=450.0,
            notes="Applied early morning. Good uniform leaf coverage.",
            follow_up_date="2026-10-30",
            status="Completed"
        ),
        FarmingActivity(
            user_id=demo_user.id,
            crop_name="Finger Millet (Ragi)",
            activity_date="2026-10-15",
            activity_type="Organic Treatment",
            pest_disease="Soil Nutrient & Microbe Boost",
            product_used="Jeevamrutha",
            quantity="200 L via flood channel",
            is_organic=True,
            cost=120.0,
            notes="Fermented for 5 days. Vigorous plant vegetative response.",
            follow_up_date="2026-10-31",
            status="Completed"
        ),
        FarmingActivity(
            user_id=demo_user.id,
            crop_name="Chilli",
            activity_date="2026-10-25",
            activity_type="Weeding",
            pest_disease=None,
            product_used=None,
            quantity=None,
            is_organic=True,
            cost=600.0,
            notes="Manual shallow weeding between rows.",
            follow_up_date=None,
            status="Completed"
        ),
        FarmingActivity(
            user_id=demo_user.id,
            crop_name="Tomato",
            activity_date="2026-10-30",
            activity_type="Spraying",
            pest_disease="Preventive Bio-Fungicide",
            product_used="Trichoderma viride",
            quantity="1 kg in 200 L water",
            is_organic=True,
            cost=300.0,
            notes="Scheduled preventive foliar wash before upcoming humid spell.",
            follow_up_date="2026-11-08",
            status="Pending"
        )
    ]
    for sa in sample_activities:
        db.add(sa)

    # Add sample notifications
    sample_notifications = [
        Notification(
            user_id=demo_user.id,
            title="Weather Spray Advisory",
            message="Light precipitation expected in Bengaluru Rural within 48 hours. Postpone chemical foliar spraying until dry weather stabilizes.",
            category="Weather",
            is_read=False
        ),
        Notification(
            user_id=demo_user.id,
            title="Activity Follow-Up Reminder",
            message="Your scheduled Trichoderma application for Tomato crop is due on 30-Oct-2026.",
            category="ActivityReminder",
            is_read=False
        ),
        Notification(
            user_id=demo_user.id,
            title="Seasonal Pest Alert: Chilli Thrips",
            message="Elevated thrips activity reported across southern Karnataka. Install blue sticky cards to track ETL threshold.",
            category="PestAlert",
            is_read=False
        ),
        Notification(
            user_id=demo_user.id,
            title="Organic Farming Tip",
            message="Applying Jeevamrutha during cloudy weather enhances microbial colonization around rhizosphere.",
            category="Tip",
            is_read=True
        )
    ]
    for sn in sample_notifications:
        db.add(sn)

    db.commit()
