from typing import List, Optional
from fastapi import APIRouter, Query

router = APIRouter(prefix="/comparison", tags=["Chemical vs Organic Comparison"])

COMPARISON_MATRICES = [
    {
        "id": "tomato-blight",
        "crop": "Tomato",
        "pest_disease": "Early & Late Blight (Alternaria / Phytophthora)",
        "scenario": "Foliar fungal and oomycete blight attacking foliage and stems during humid monsoon spells.",
        "chemical": {
            "title": "Synthetic Fungicides (Mancozeb 75% WP + Cymoxanil)",
            "cost": "₹800 - ₹1,200 per acre per application",
            "effectiveness": "High immediate knock-down (90-95% spore inhibition within 24 hours)",
            "safety_precautions": "Strict PPE: respirators, nitrile gloves, skin coverage. High inhalation risk.",
            "environmental_considerations": "Moderately toxic to aquatic invertebrates; chemical residue persists 7-14 days.",
            "availability": "Widely available at all rural retail agro-dealers",
            "application_complexity": "Moderate: requires accurate tank measuring and calibrated pressure nozzles",
            "pre_harvest_interval": "7 to 14 days waiting period before picking",
            "suitability": "Best for emergency outbreak rescue when infection exceeds 20% leaf area"
        },
        "organic": {
            "title": "Bio-Agents & Copper (Trichoderma viride + Copper Oxychloride)",
            "cost": "₹350 - ₹500 per acre per application (60% lower cost)",
            "effectiveness": "Moderate to High preventive control (75-85% reduction if applied prophylactically)",
            "safety_precautions": "Minimal PPE: basic dust mask and gloves. Non-toxic to human operators.",
            "environmental_considerations": "Safe for soil organisms, earthworms, and pollinating bees. Zero toxic runoff.",
            "availability": "Available through KVKs, organic certifiers, and biological input manufacturers",
            "application_complexity": "Easy: can be mixed with organic compost or sprayed with standard backpack sprayer",
            "pre_harvest_interval": "Zero days (harvest safe immediately after drying)",
            "suitability": "Best for sustainable seasonal prevention and low-toxicity organic export crops"
        }
    },
    {
        "id": "cotton-bollworm",
        "crop": "Cotton",
        "pest_disease": "American Bollworm & Spodoptera Caterpillars",
        "scenario": "Larvae boring into squares, flowers, and developing bolls causing heavy yield loss.",
        "chemical": {
            "title": "Chlorantraniliprole 18.5% SC / Emamectin Benzoate 5% SG",
            "cost": "₹1,100 - ₹1,500 per acre per spray",
            "effectiveness": "Very High (rapid feeding cessation within 2 hours, 95% mortality)",
            "safety_precautions": "Full protective gear required. Keep livestock away from field for 3 days.",
            "environmental_considerations": "Toxic to aquatic life if drained; risks pest resistance over repeated cycles.",
            "availability": "High in all major cotton growing districts",
            "application_complexity": "Low to Moderate",
            "pre_harvest_interval": "14 days",
            "suitability": "Effective for severe larval infestation exceeding Economic Threshold Level (ETL)"
        },
        "organic": {
            "title": "Pheromone Traps + Bacillus thuringiensis (Bt) + Neem Oil",
            "cost": "₹400 - ₹650 per acre (traps + bio-spray)",
            "effectiveness": "High preventive & early larval control (80-88% reduction in egg laying)",
            "safety_precautions": "Completely non-hazardous to operators and animals.",
            "environmental_considerations": "Preserves predatory spiders, Chrysoperla, and parasitic Trichogramma wasps.",
            "availability": "Moderately high via State Agriculture Departments and IPM centers",
            "application_complexity": "Requires routine monitoring: checking pheromone lures every 15-20 days",
            "pre_harvest_interval": "0 days",
            "suitability": "Superior long-term ecological balance; prevents chemical resistance resurgence"
        }
    },
    {
        "id": "chilli-thrips",
        "crop": "Chilli",
        "pest_disease": "Thrips (Scirtothrips dorsalis) & Mites",
        "scenario": "Sucking pests rasping foliage, causing severe leaf curling and flower bud drop.",
        "chemical": {
            "title": "Fipronil 5% SC / Spinetoram 11.7% SC",
            "cost": "₹950 - ₹1,400 per acre",
            "effectiveness": "High contact and systemic eradication (88-92%)",
            "safety_precautions": "Prohibited near bee colonies. Face shield and chemical overalls required.",
            "environmental_considerations": "Detrimental to beneficial honeybees; can trigger mite resurgence.",
            "availability": "Readily available",
            "application_complexity": "Moderate",
            "pre_harvest_interval": "10 to 15 days",
            "suitability": "Rapid knockdown for severe thrips flare-ups during hot dry spells"
        },
        "organic": {
            "title": "Blue Sticky Traps + Beauveria bassiana + Dashaparni Kashayam",
            "cost": "₹380 - ₹600 per acre",
            "effectiveness": "Good (75-82% population suppression through continuous fungal infection)",
            "safety_precautions": "Non-toxic, safe handling.",
            "environmental_considerations": "Zero toxic residue on green chillies. Safe for natural insect predators.",
            "availability": "Available through organic input producers & farm cooperatives",
            "application_complexity": "Requires installation of 30 blue traps per acre + evening spraying",
            "pre_harvest_interval": "0 days",
            "suitability": "Ideal for clean chemical-free vegetable production and safe continuous harvesting"
        }
    },
    {
        "id": "rice-blast",
        "crop": "Rice (Paddy)",
        "pest_disease": "Blast (Magnaporthe oryzae) & Stem Borer",
        "scenario": "Spindle lesions on foliage and neck blast causing white ears at grain filling.",
        "chemical": {
            "title": "Tricyclazole 75% WP + Cartap Hydrochloride 4G",
            "cost": "₹900 - ₹1,350 per acre",
            "effectiveness": "Very High systemic preventative protection (92-96%)",
            "safety_precautions": "Chemical rubber gloves and eye protection. Do not apply near fish ponds.",
            "environmental_considerations": "Significant leaching potential in standing paddy water.",
            "availability": "Very high across all paddy belt dealers",
            "application_complexity": "Moderate: requires high water volume (200 L/acre)",
            "pre_harvest_interval": "21 days",
            "suitability": "Recommended during sudden neck blast outbreaks in high-yielding varieties"
        },
        "organic": {
            "title": "Pseudomonas fluorescens + Cow Urine Spray + Balanced Nitrogen",
            "cost": "₹300 - ₹450 per acre",
            "effectiveness": "High (80-85% disease restriction via systemic induced resistance)",
            "safety_precautions": "Zero hazard to humans and cattle.",
            "environmental_considerations": "Enhances aquatic microbial diversity in paddy ecosystems.",
            "availability": "Widely supplied through Krishi Vigyan Kendras and RSKs",
            "application_complexity": "Low: easily mixed in water with organic cow urine",
            "pre_harvest_interval": "0 days",
            "suitability": "Optimal for organic basmati and indigenous heritage rice varieties"
        }
    }
]

@router.get("")
def get_comparisons(
    crop: Optional[str] = Query(None, description="Filter by crop name"),
    pest: Optional[str] = Query(None, description="Filter by pest name")
):
    results = COMPARISON_MATRICES
    if crop and crop.strip():
        c_term = crop.strip().lower()
        results = [r for r in results if c_term in r["crop"].lower()]
    if pest and pest.strip():
        p_term = pest.strip().lower()
        results = [r for r in results if p_term in r["pest_disease"].lower()]
    return results
