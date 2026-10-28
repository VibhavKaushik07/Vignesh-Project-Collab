import os
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from backend.app.models.models import Pesticide, OrganicAlternative, EducationalResource

SUGGESTED_QUESTIONS = [
    "How can I prepare Jeevamrutha at home?",
    "What is the recommended pesticide dosage for Tomato Early Blight?",
    "How do yellow sticky traps work for whiteflies?",
    "What safety precautions should I take when spraying insecticides?",
    "How does crop rotation improve soil health?",
    "What is the Pre-Harvest Interval (PHI) for Coragen?"
]

def generate_assistant_response(db: Session, user_query: str, language: str = "en") -> Dict[str, Any]:
    query_lower = user_query.lower()
    sources = []
    response_text = ""

    # 1. Check for Organic formulations (Jeevamrutha, Neem, Panchagavya, Trichoderma, etc.)
    if any(k in query_lower for k in ["jeevamrutha", "jeevamrit", "bio-enhancer", "cow dung"]):
        sources.append("National Centre of Organic and Natural Farming (NCOF) Guidelines")
        sources.append("Subhash Palekar Natural Farming (SPNF) Technical Dossier")
        response_text = (
            "**Jeevamrutha Preparation & Application Guide**\n\n"
            "**Ingredients for 1 Acre (200 L Water):**\n"
            "- 10 kg native desi cow dung\n"
            "- 10 litres native cow urine\n"
            "- 2 kg organic jaggery\n"
            "- 2 kg pulse flour (besan/gram flour)\n"
            "- Handful of fertile virgin soil from a field bund or banyan tree base\n\n"
            "**Procedure:**\n"
            "1. Mix all ingredients in a 200 L barrel kept under shade.\n"
            "2. Stir clockwise for 2-3 minutes twice daily for 4-5 days.\n"
            "3. Fermentation activates millions of beneficial aerobic microbes (bacteria, fungi, actinomycetes).\n\n"
            "**Application:**\n"
            "- Apply 200 L per acre through irrigation water or root zone drenching every 14-21 days.\n"
            "- For foliar spraying, filter thoroughly through double muslin cloth and spray at 10% dilution (1 L in 10 L water)."
        )

    elif any(k in query_lower for k in ["neem", "azadirachtin", "botanical"]):
        sources.append("ICAR-Indian Agricultural Research Institute (IARI) Bio-Pesticide Division")
        response_text = (
            "**Neem-Based Bio-Pesticide Advisory**\n\n"
            "- **Active Constituent:** Azadirachtin (available in 1,500 ppm, 3,000 ppm, 10,000 ppm formulations).\n"
            "- **Mechanism:** Anti-feedant, repellent, and insect growth regulator (IGR). It inhibits ecdysone hormone, halting pest moulting.\n"
            "- **Dosage:** 3 to 5 ml per Litre of water (for 10,000 ppm formulation).\n"
            "- **Emulsification:** Add 1 ml mild liquid soap per litre of water to ensure complete oil dispersion.\n"
            "- **Application Timing:** Spray early morning (6:00 - 8:30 AM) or late evening (4:30 - 6:30 PM). Sunlight UV degrades azadirachtin.\n"
            "- **Safety:** Zero Pre-Harvest Interval (PHI = 0 days); completely safe for honeybees, ladybugs, and earthworms."
        )

    elif any(k in query_lower for k in ["blight", "early blight", "late blight", "tomato disease", "potato disease"]):
        sources.append("ICAR-IIHR Tomato Disease Advisory Bulletin")
        sources.append("CIBRC Approved Product Gazette")
        response_text = (
            "**Blight Disease Identification and Management**\n\n"
            "**Early Blight (Alternaria solani):**\n"
            "- Identified by brown concentric target-like rings on older leaves.\n"
            "- *Organic Treatment:* Spray cold-pressed Neem Oil (10,000 ppm) @ 3 ml/L or Trichoderma viride @ 5 g/L.\n"
            "- *Chemical Option:* Mancozeb 75% WP @ 2.5 g/L (Preventive) or Azoxystrobin + Difenoconazole SC @ 1.0 ml/L (Curative).\n\n"
            "**Late Blight (Phytophthora infestans):**\n"
            "- Rapidly expanding dark water-soaked lesions with white downy mold underneath during cool, misty weather.\n"
            "- *Organic Option:* Copper Oxychloride 50% WP @ 2.5 g/L.\n"
            "- *Chemical Option:* Cymoxanil + Mancozeb WP @ 2.5 g/L. Always observe a 7-day waiting period before harvest."
        )

    elif any(k in query_lower for k in ["pesticide safety", "safety precautions", "ppe", "protective equipment"]):
        sources.append("Central Insecticides Board & Registration Committee (CIBRC) Operator Safety Standards")
        response_text = (
            "**Standard Pesticide Application Safety Protocol (CIBRC Mandatory)**\n\n"
            "1. **Personal Protective Equipment (PPE):** Always wear chemical-resistant nitrile gloves, N95/organic vapor mask, eye goggles, full-sleeve coverall, and gumboots.\n"
            "2. **Spray Direction:** Never spray facing against the wind. Always walk backwards away from the spray swath.\n"
            "3. **Equipment Care:** Check sprayer nozzles and delivery hose for leaks with clean water before mixing chemicals.\n"
            "4. **No Eating or Smoking:** Never eat, drink, chew tobacco, or rub eyes during chemical handling.\n"
            "5. **Post-Application Hygiene:** Immediately bathe with soap and wash clothing separately. Do not reuse chemical containers for domestic storage; triple-rinse and puncture them."
        )

    elif any(k in query_lower for k in ["compost", "vermicompost", "soil health", "organic matter"]):
        sources.append("ICAR-Indian Institute of Soil Science (IISS), Bhopal")
        response_text = (
            "**Soil Organic Carbon & Farm Composting Best Practices**\n\n"
            "- **The 30:1 Rule:** Balance 2 parts brown carbon material (dry straw, shredded stalks) with 1 part green nitrogen material (fresh cow dung slurry, green grass).\n"
            "- **Aerobic Turning:** Turn compost heap every 15 days to infuse oxygen and maintain temperature between 55-65°C to sterilize weed seeds and pathogenic spores.\n"
            "- **Vermicomposting:** Use *Eisenia fetida* earthworms with pre-decomposed farm waste. Maintain 60% moisture under thatch shade. Premium vermicompost will be ready in 45-60 days."
        )

    else:
        # Search verified pesticides in DB
        pest_matches = db.query(Pesticide).filter(
            (Pesticide.brand_name.ilike(f"%{user_query}%")) |
            (Pesticide.technical_name.ilike(f"%{user_query}%")) |
            (Pesticide.target_pests.ilike(f"%{user_query}%")) |
            (Pesticide.registered_crops.ilike(f"%{user_query}%"))
        ).limit(2).all()

        if pest_matches:
            sources.append("Central Insecticides Board & Registration Committee (CIBRC)")
            details = []
            for p in pest_matches:
                details.append(
                    f"**{p.brand_name}** ({p.category})\n"
                    f"- **Technical Name:** {p.technical_name}\n"
                    "- **Target Pests:** " + p.target_pests + "\n"
                    "- **Registered Crops:** " + p.registered_crops + "\n"
                    "- **Label Dosage:** " + p.label_dosage + f" (Dilution: {p.dilution_ratio})\n"
                    f"- **Pre-Harvest Interval (PHI):** {p.pre_harvest_interval_days} days\n"
                    f"- **Toxicity Band:** {p.toxicity_band} Triangle\n"
                    "- **Safety:** " + p.safety_precautions[:140] + "..."
                )
            response_text = "Here is verified label information from the official CIBRC registry:\n\n" + "\n\n".join(details)
        else:
            sources.append("KrishiRakshak Agricultural Knowledge Base (ICAR / NCOF)")
            response_text = (
                f"Thank you for contacting KrishiRakshak AI Assistant. Regarding your question on *\"{user_query}\"*:\n\n"
                "In sustainable agronomy, it is recommended to first assess pest severity using Economic Threshold Levels (ETL). "
                "For crop nutrition, emphasize soil organic carbon restoration through green manuring (*Daincha* or *Sunnhemp*), "
                "well-fermented Jeevamrutha, and vermicompost.\n\n"
                "For pest protection, prioritize biological agents such as *Trichoderma viride* for soil-borne wilts, "
                "*Beauveria bassiana* for sucking insects, and neem formulations (Azadirachtin 10,000 ppm). "
                "If chemical control is unavoidable, select green or blue triangle molecules and strictly follow registered dosage."
            )

    # Multilingual translation hints if language is Kannada or Hindi
    if language == "kn":
        response_text = "🌾 **ಕೃಷಿ ರಕ್ಷಕ್ ಎಐ ಸಹಾಯಕ (ಕನ್ನಡ):**\n\n" + response_text
    elif language == "hi":
        response_text = "🌾 **कृषि रक्षक एआई सहायक (हिंदी):**\n\n" + response_text

    return {
        "response": response_text,
        "language": language,
        "sources": sources,
        "suggested_questions": SUGGESTED_QUESTIONS
    }
