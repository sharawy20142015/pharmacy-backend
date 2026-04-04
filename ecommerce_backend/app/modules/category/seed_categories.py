from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.Category import Category

# الداتا المستخرجة من تصميمك
CATEGORIES_DATA = [
    {"name": "منتجات الجمال", "slug": "beauty-care", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDlOPEJ6vZvtlo2VDnaRIH2zssk-2NJAXLtjU8E5R-kbJ7f_bYhbcI3SXdJQu607j5cg509z7ZVGip6VEi5tUIUSruhZ3s0nwUi4eyIhLF0_sWKhv5tpYn0NZ2hbVRxbltgBOkYjKflZxOeLim57Ox2Qm-8f2D1LHJKsHVl0fF0c9GAWf3Mi5N0jk-NeG99D8ObTD1MPgfeaYcdoF6n_IUvX9eLpwjHKjot8SRraLRAYCSlDI1lSKr7_5sErLPyiK0qtUFAeNfZiw"},
    {"name": "الفيتامينات والمكملات الغذائية", "slug": "vitamins-and-supplements", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAZFmCWDMgFZFc7N_mSVMjgjAGmzI6CRf5ho8qZbbYUjlyHDvVmtQ3UQEaFVJQxAEQ4wrK0QaQQYp-5V8N8ji-SS30jB3CCWICk8l-UCPfHlxBmw6SUZFg_Xgis3cl9QaCCNFeStQOz79pZhw4gffrqHTkZLO9Im15MdlUYUzt0cbjMttrOrE7BIv6tDEHAulXgLMIM5_Cxxljjv8HJOCH2EAPVvZ5BJ23z0sXanPASWeruWDo3NipuBmKSGiE9xjX92QEolPz9Nw"},
    {"name": "الصحة الجنسية", "slug": "sexual-health", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuAV55TUb9LyZjJOHFI6Ego64Wbe8j5Idf2tQVyNB2-KnIC6pdH6lSdHakL7bTGZi4dE2NwTr7igoyjr9FjsBaBG5xmL7v-1dYN1NZw_dhTN3oZxTFECqV62PROUA6KMJ9Q3xSWbmtG9qkdXZ0rraUtqZygVKMxQ2TVySyHJkQaf_tjT8lHpYghNO4TjkbZr6sCCbfh_LbKHQtIMY4NaRREt3gxQCfwXJ4H_tfMbdt2tw-_Iltje39squlv9zY1z_oWnvSHFvecWUg"},
    {"name": "العناية بالبشرة", "slug": "skincare", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuBzFCcF2yD5Z50nkoC0A9Gwt3TAyY2xJcUcq1wooLLVU44W8hkyJpsOpHbW-Mss3sNsvwoti1AlkbPuj88r7B3S8qF-NLP3zkx05W6xke3IXfMajn69PrHGRS1DHq_018x6vQYyG8WKd6LQESFuVPquRTDHVhsMF_bgY21uzzpEHHFqKCnWTmxq6k8rJ8557Li7SG3xLnIvmbrAt5mJJgIXtV8ZEkZbn99y658axNuOtL1Ed1XieAJjMwde8BNmvreeIWlZwS-XRg"},
    {"name": "الأم والطفل", "slug": "mother-and-baby", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuA7RPDfho4pJU22TcVIxXrC_iNSM745MPIWO_htskIi0sIxXyenYFwLjl_KpOrj-vjkuRYDVodsezGkQPBAYm9zcm8sSXbl4ThwGw-4Cn-O0VUy7Wl-gvjKc7xtRTUZGx2HPEPPqjdSfQ-3DDcXHpOwkULxnZoG5FMr6vSFxiblFGiQYtiIQOHkVsPKXbx1Q-yx1tKuCRhzt2X4gpabNyHtArspOqZX3uZ8qRiFWMBaL3C2oLmfbqQ584zpbfbyUg5J0eES4WgY0A"},
    {"name": "العناية بالشعر", "slug": "hair-care", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCaBbva6UzC43cnWH38sSECaY5x2S7bOtshsb-oTrfsx5VNGSkKG3Ks0G9MOKkhjYC-JTI0GDvbvLElcKsmaRZEY1-BlJIxHwkua67EFQS3FkmbT4ihQA6dygtPoKJTzYE5kd0nypw7-U8FRWy-OyJfE0sFEsQH3M-LDgsf0JUhKU6PeoU8e71kfL3io1AlJdSBiXQYLqmpDsGUSICwsbPOXjxX09WcKmP8XvjECAvwCjva2fZpBr5WInTTVchtMQzE7vERTWm3JA"},
    {"name": "العناية اليومية", "slug": "daily-care", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCksCK4XXCEYEO3_GS7WHTniNEqGaftYAJAHsGXxvAFv1qCIdZkvLDJFr7GUN8d26ZKVBQahEpVVHASnGpVs5UmKoo5MwnTDMz-OBYFNCM9sH_zbf7xDqBwb_7jcIi1ELTezi7nZcSjKyMlbSayCla8Biw_AxQDSFCqtGemU2j14LgMsBs1FfQ57KVCZv7XurOvWnGC-0R9Kh-tt-pF-mQaL9_mNW_eYqFPTLFud7zeut-Q6gxhuZM2mhiLCIlimjwL0kLH90VLUQ"},
    {"name": "صحة الطفل", "slug": "child-health", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuC4gWo_N2VvFeaQWZ9DBXY8_6MJWyaxzRi7z_r5dfeG8-dFS3BTWYKJXx6nT6W0vivLupQ32ssLpUCcKllq-o3e1SE527E3fzkO6yGLDt3OPdUCAwSY9bbnAJQxrSZtpfzNrImod1A75NGo5uPfRgedh8S4FnAjv_5js3o79bAZBrzFyjQl4l40pu4Pgf6FUhA9_5HCgnZUCor6GJPHznyLd2WDJs_YRqRE0X3LXmRDR1Y8k8hFMthkFO_dH5b-y0DrPPU1Iv887w"},
    {"name": "الأدوية", "slug": "medicines", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuDNYqX8k8Uo7woGD53k7I2smOBKUir92lT4nYeUJ4qY4K0s98kjRk_fBBfpF1sjzspXyM5uE5BbiiNkWB67-kGX3Cv5ZGEKLvlhqawNHk_0E9Ur6vAuCBbqeTFhGpkw1jGL2bWrK3mfSPVYpClJSZ2vMvMNXqeUF_SqcP7d4IezjABnnihqUoK6wcV-Tim7rbZGmtnHDuuXu-be1XsZp4Dx5uoUh0RmVKlYeXMrdPJ2dE9H4CsIqQt5oX8v9l07VOS5Y0sxXVYrKw"},
    {"name": "إنقاص الوزن واللياقة", "slug": "weight-loss-fitness", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuA6WWl1DMHcz-FwEuVBtRACz9y4jjZkHBYy92WTSkRuBsZ1Bz2No5zxtfSEKmg8HqOmHVlbtyPi-QmsWApZGAOfdxuI3QKt9JGN44nd8cie3XPBuUMMh_A3qht1rjYqIT1AN_4OCDF4I1jjJbN79xXWbPml-TtCthvEPx2OxqaxEQrZ89-ykst4hnS7DzAfdYO8HrgD_eLz328Lmo62a2DBwh6x9tgNw8wxT6SXavVoei3YlGvWMRNSOgDELoge8q_uf7od0J5_Yg"},
    {"name": "العناية الشخصية", "slug": "personal-care", "img_url": "https://lh3.googleusercontent.com/aida-public/AB6AXuCIvkxr9DE-f3DkTfSxLcvMcRDRo_PeTQYe5NQCwtvUoBRoqHQUimbIvv96WPwcr8M04k9tWUZvJloADrA0PhxQHKGJk7dr87y9NE289GFi4_B48vLnnkVYAghclzJCtJdyx54_r9kCqHU7PrwhmJmocvz5gUPR9VVLh0tMBkAn_CYb7QpKxSTLqKEO_k3gwaPl8xHW4KG7Rkm16JFb4FEItgcdY2tbm33_xotihzGvTQSaGnEIt-vZoVxjkdhvzI9YsHdIuaBEoA"}
]

async def auto_seed_categories():
    """
    دالة للتحقق من وجود الأقسام الأساسية وإضافتها إذا لم تكن موجودة.
    """
    async with AsyncSessionLocal() as session:
        added_count = 0
        for cat_data in CATEGORIES_DATA:
            # نبحث عن القسم باستخدام الـ slug
            query = select(Category).where(Category.slug == cat_data["slug"])
            result = await session.execute(query)
            existing_category = result.scalars().first()
            
            # لو القسم مش موجود، نجهزه للإضافة
            if not existing_category:
                new_category = Category(
                    name=cat_data["name"],
                    slug=cat_data["slug"],
                    img_url=cat_data["img_url"],
                    level=0,          # قسم رئيسي
                    parent_id=None    # بدون أب
                )
                session.add(new_category)
                added_count += 1
        
        # لو في أقسام جديدة اتضافت للـ session، نعمل حفظ (Commit)
        if added_count > 0:
            await session.commit()
            print(f"✅ Category Auto Seed: Successfully added {added_count} new categories.")