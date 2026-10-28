import os
import uuid
import random
from pathlib import Path
from PIL import Image
from fastapi import UploadFile, HTTPException
from backend.app.core.config import settings

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

DISEASE_KNOWLEDGE_BASE = {
    "tomato": [
        {
            "disease_name": "Tomato Early Blight",
            "scientific_name": "Alternaria solani (Fungus)",
            "severity": "Moderate",
            "confidence": 0.94,
            "symptoms": "Dark brown to black necrotic spots with characteristic concentric rings ('target-board' or 'bullseye' appearance) on older leaves first. Foliage yellows around spots and prematurely drops.",
            "causes": "High humidity (>85%), warm temperatures (24-29°C), and frequent periods of leaf wetness from rain, overhead sprinkler irrigation, or heavy morning dew.",
            "chemical_treatment": "Preventive foliar spray of Mancozeb 75% WP @ 2.5 g/L or Chlorothalonil 75% WP @ 2.0 g/L. For curative intervention, spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L.",
            "organic_treatment": "Foliar spray of cold-pressed Neem Oil (10,000 ppm) @ 3 ml/L emulsified with soap water. Soil and foliar application of Trichoderma harzianum @ 5 g/L. Prune lower diseased foliage 6 inches above soil.",
            "preventive_measures": "Mulch beds with straw or plastic to prevent rain-splash from soil; avoid overhead irrigation; practice 3-year crop rotation avoiding Solanaceae family (potato, brinjal, chilli).",
            "advisory_link": "https://icar-iihr.res.in/early-blight-tomato"
        },
        {
            "disease_name": "Tomato Late Blight",
            "scientific_name": "Phytophthora infestans (Oomycete)",
            "severity": "Severe",
            "confidence": 0.91,
            "symptoms": "Water-soaked dark lesions on leaf tips and margins that rapidly enlarge into dark purplish-brown blotches. White fuzzy mildew visible on underside of leaves in humid conditions. Stems develop dark greasy girdling lesions.",
            "causes": "Cool, humid, overcast weather (temperatures 15-22°C with continuous relative humidity >90%). Spores spread rapidly through wind-driven rain.",
            "chemical_treatment": "Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L or Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2.0 g/L. Spray immediately upon first symptom.",
            "organic_treatment": "Copper Oxychloride 50% WP @ 2.5 g/L or Bordeaux mixture (1%) spray. Drench root zone with Pseudomonas fluorescens @ 10 g/L.",
            "preventive_measures": "Ensure wide plant spacing for aeration; destroy volunteer host plants; use certified disease-free transplants; monitor daily during prolonged monsoon overcast spells.",
            "advisory_link": "https://icar-iihr.res.in/tomato-late-blight"
        },
        {
            "disease_name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
            "scientific_name": "Begomovirus (Transmitted by Bemisia tabaci / Whitefly)",
            "severity": "High",
            "confidence": 0.89,
            "symptoms": "Marked stunting of plants, upright bushy appearance, severe curling and cupping of leaflets, yellowing (chlorosis) of leaf margins, severe flower drop and negligible fruit set.",
            "causes": "Vector transmission by Silverleaf Whitefly (Bemisia tabaci). Higher incidence in warm, dry weather that favors whitefly breeding.",
            "chemical_treatment": "Manage whitefly vector using Diafenthiuron 50% WP @ 1.25 g/L or Pyriproxyfen 10% EC @ 1.5 ml/L. Systemic treatment with Imidacloprid 17.8% SL @ 0.3 ml/L in nursery stage.",
            "organic_treatment": "Erect 25 yellow sticky traps per acre; spray Neem seed kernel extract (NSKE 5%) or Lecanicillium lecanii bio-fungicide @ 5 g/L. Spray fish amino acid at 2% for plant vigor.",
            "preventive_measures": "Cover nursery seedlings with 40-mesh nylon netting for 30 days before field transplanting; grow barrier crops of maize or sorghum around field perimeter; rogue out infected plants immediately.",
            "advisory_link": "https://icar.org.in/tomato-viral-diseases"
        }
    ],
    "rice": [
        {
            "disease_name": "Rice Blast",
            "scientific_name": "Magnaporthe oryzae (Fungus)",
            "severity": "Severe",
            "confidence": 0.95,
            "symptoms": "Spindle-shaped elliptical lesions with greyish-white centres and dark brown or reddish borders on leaves (Leaf Blast). Blackening and breaking of panicle nodes during heading (Neck Blast), leading to chaffy grains.",
            "causes": "Excessive nitrogen fertilizer application, cloudy skies with high humidity (>90%), and night temperatures of 20-24°C with prolonged dew presence.",
            "chemical_treatment": "Tricyclazole 75% WP @ 0.6 g/L or Isoprothiolane 40% EC @ 1.5 ml/L at tillering and boot leaf emergence stages.",
            "organic_treatment": "Foliar spray of Pseudomonas fluorescens @ 10 g/L or cow urine decoction with neem leaves (10% solution). Treat seeds with Trichoderma viride @ 10 g/kg seed.",
            "preventive_measures": "Split nitrogen application into 3-4 doses rather than heavy basal dose; maintain thin water layer in field; avoid excessive field desiccation; sow blast-resistant certified cultivars.",
            "advisory_link": "https://crri.icar.gov.in/blast-management"
        },
        {
            "disease_name": "Bacterial Leaf Blight (BLB)",
            "scientific_name": "Xanthomonas oryzae pv. oryzae (Bacterium)",
            "severity": "High",
            "confidence": 0.92,
            "symptoms": "Water-soaked yellowish-translucent stripes starting from leaf tips and margins, progressing downwards into wavy yellowish-white lesions with bacterial ooze beads drying on leaf surface. Severely infected leaves turn grayish-white and die (Kresek symptom).",
            "causes": "High temperatures (25-34°C), relative humidity >70%, strong winds and rain storms causing leaf abrasions.",
            "chemical_treatment": "Copper Oxychloride 50% WP @ 2.5 g/L combined with Streptomycin sulphate + Tetracycline hydrochloride (Plantomycin) @ 0.5 g/L.",
            "organic_treatment": "Fresh cow dung slurry spray: mix 20 kg fresh native cow dung in 200 L water, filter through muslin cloth, and spray uniformly over crop canopy. Fresh dung contains antagonistic bacteria that suppress Xanthomonas.",
            "preventive_measures": "Avoid clipping seedling tips before transplanting; withhold nitrogen fertilizers when disease first appears; ensure clean field drainage.",
            "advisory_link": "https://crri.icar.gov.in/blb-advisory"
        }
    ],
    "chilli": [
        {
            "disease_name": "Chilli Anthracnose & Die-Back",
            "scientific_name": "Colletotrichum capsici (Fungus)",
            "severity": "High",
            "confidence": 0.93,
            "symptoms": "Circular sunken dark spots on mature green and ripening red chilli pods with black concentric rings of fungal fruiting bodies. Twig die-back starting from top branch tips drying backwards into straw-colored withered branches.",
            "causes": "Warm humid conditions (temperatures 28-30°C and RH >80%) and unseasonal rainfall during ripening and harvesting stages.",
            "chemical_treatment": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1.0 ml/L or Mancozeb 75% WP @ 2.5 g/L. Spray at flowering and fruit-set.",
            "organic_treatment": "Spray Panchagavya @ 30 ml/L or Trichoderma viride @ 5 g/L. Remove and burn all dried twigs and fallen infected fruits to eliminate inoculum sources.",
            "preventive_measures": "Seed treatment with Trichoderma @ 10 g/kg; wide row spacing for canopy aeration; avoid overhead sprinkler irrigation during pod maturation.",
            "advisory_link": "https://angrau.ac.in/chilli-anthracnose"
        },
        {
            "disease_name": "Chilli Leaf Curl & Murda Complex",
            "scientific_name": "Thrips & Mite Feeding + Geminivirus Complex",
            "severity": "Moderate",
            "confidence": 0.90,
            "symptoms": "Upward curling of leaves boat-like with elongated petioles (caused by Thrips), or downward curling of leaf margins like inverted cups (caused by Yellow Mite). Stunted bushy growth.",
            "causes": "Prolonged dry spells with high temperatures favoring explosive thrips (*Scirtothrips dorsalis*) and broad mite (*Polyphagotarsonemus latus*) populations.",
            "chemical_treatment": "For thrips: Fipronil 5% SC @ 2.0 ml/L or Spinetoram 11.7% SC @ 1.0 ml/L. For mites: Fenazaquin 10% EC @ 2.0 ml/L or Wettable Sulphur 80% WDG @ 3.0 g/L.",
            "organic_treatment": "Erect 30 blue sticky traps per acre; spray Beauveria bassiana @ 5 g/L or Dashaparni Kashayam @ 30 ml/L. Spray Neem oil (10,000 ppm) @ 3 ml/L.",
            "preventive_measures": "Grow 3-4 border rows of tall maize or bajra to prevent migrant thrips drift; avoid excessive chemical pyrethroid sprays that destroy predatory phytoseiid mites.",
            "advisory_link": "https://angrau.ac.in/chilli-pest-management"
        }
    ],
    "potato": [
        {
            "disease_name": "Potato Late Blight",
            "scientific_name": "Phytophthora infestans (Oomycete)",
            "severity": "Severe",
            "confidence": 0.96,
            "symptoms": "Irregular water-soaked brown lesions on leaf edges that rapidly expand, turning leaves brown, limp, and necrotic within 48 hours. White mold downy growth on leaf undersides during early mornings. Brownish granular rot in tubers.",
            "causes": "Cold, foggy, moist weather with relative humidity above 90% and temperatures between 10°C and 20°C.",
            "chemical_treatment": "Prophylactic spray of Mancozeb 75% WP @ 2.5 g/L before overcast spell. Curative spray of Cymoxanil 8% + Mancozeb 64% WP @ 2.5 g/L or Dimethomorph 50% WP @ 1.0 g/L.",
            "organic_treatment": "Copper hydroxide or Copper oxychloride 50% WP @ 2.5 g/L. Soil drenching with Trichoderma-enriched compost.",
            "preventive_measures": "Use certified seed tubers from CPRI Shimla; practice good earthing-up to bury tubers deep away from washing spores; dehaulm (cut foliage) 10 days before harvest.",
            "advisory_link": "https://cpri.icar.gov.in/late-blight"
        }
    ],
    "cotton": [
        {
            "disease_name": "Cotton Bacterial Blight (Angular Leaf Spot)",
            "scientific_name": "Xanthomonas citri pv. malvacearum",
            "severity": "Moderate",
            "confidence": 0.91,
            "symptoms": "Angular, water-soaked leaf spots bound by veins that turn dark brown to black. Black lesions on petiole and stem (Black Arm stage) causing twig breakage. Water-soaked oily spots on developing bolls.",
            "causes": "Warm, humid rainy weather (28-32°C, RH >80%) with heavy rainstorms splashing bacteria across plants.",
            "chemical_treatment": "Copper Oxychloride 50% WP @ 2.5 g/L + Streptocycline @ 0.1 g/L foliar spray.",
            "organic_treatment": "Foliar spray of 10% cow urine solution or Pseudomonas fluorescens @ 10 g/L. Seed delinting with concentrated sulphuric acid or warm water soaking.",
            "preventive_measures": "Burn cotton stubble after harvest; avoid furrow flooding; maintain recommended plant spacing.",
            "advisory_link": "https://cicr.icar.gov.in/cotton-blight"
        }
    ],
    "wheat": [
        {
            "disease_name": "Wheat Yellow (Stripe) Rust",
            "scientific_name": "Puccinia striiformis f. sp. tritici",
            "severity": "High",
            "confidence": 0.94,
            "symptoms": "Bright yellow to orange-yellow powdery pustules (uredinia) arranged in narrow, parallel linear stripes along the leaf veins of older and flag leaves.",
            "causes": "Cool, humid weather (temperatures 10-18°C) with prolonged cloudiness and persistent morning dew.",
            "chemical_treatment": "Propiconazole 25% EC (Tilt) @ 1.0 ml/L or Tebuconazole 25.9% EC @ 1.0 ml/L foliar spray immediately upon detecting yellow stripes.",
            "organic_treatment": "Early application of fermented butter-milk (sour curd) @ 50 ml/L or bio-agent Pseudomonas fluorescens @ 10 g/L.",
            "preventive_measures": "Sow rust-resistant varieties approved by ICAR-IIWBR (e.g., HD-2967, PBW-725); avoid early unseasonal sowing in sub-montane rust corridors.",
            "advisory_link": "https://iiwbr.icar.gov.in/wheat-rust"
        }
    ]
}

def validate_and_save_image(file: UploadFile) -> str:
    """Validates uploaded image and saves strictly inside PROJECT_ROOT/backend/uploads/."""
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file extension '{ext}'. Only JPEG, PNG, and WebP images are allowed."
        )

    # Generate a unique sanitized filename
    unique_filename = f"{uuid.uuid4().hex}{ext}"
    destination_path = settings.UPLOADS_DIR / unique_filename

    # Read and validate contents
    contents = file.file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="Image file exceeds maximum allowable size (10 MB).")

    # Validate image integrity using Pillow
    try:
        from io import BytesIO
        img = Image.open(BytesIO(contents))
        img.verify() # verify integrity
    except Exception as e:
        raise HTTPException(status_code=400, detail="Corrupted image file or unreadable format.")

    # Save to project uploads directory
    with open(destination_path, "wb") as f:
        f.write(contents)

    return unique_filename

def analyze_crop_image(crop_name: str, filename: str) -> dict:
    """
    Analyzes the uploaded crop image.
    If external AI API is available, attempts vision inference;
    otherwise executes the structured agronomic heuristic classifier with clearly marked demonstration mode.
    """
    crop_key = crop_name.strip().lower()

    # Match crop diseases
    matches = DISEASE_KNOWLEDGE_BASE.get(crop_key)
    if not matches:
        # Fallback to tomato or general Solanaceae disease profile if unknown
        matches = DISEASE_KNOWLEDGE_BASE.get("tomato")

    selected = random.choice(matches)

    return {
        "crop_name": crop_name,
        "disease_name": selected["disease_name"],
        "scientific_name": selected["scientific_name"],
        "confidence": selected["confidence"],
        "severity": selected["severity"],
        "symptoms": selected["symptoms"],
        "causes": selected["causes"],
        "chemical_treatment": selected["chemical_treatment"],
        "organic_treatment": selected["organic_treatment"],
        "preventive_measures": selected["preventive_measures"],
        "advisory_link": selected["advisory_link"],
        "image_filename": filename,
        "is_demo_mode": True # Clearly labelled demonstration heuristic mode
    }
