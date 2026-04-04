from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.services.excel_service import process_excel_import, generate_product_template
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/bulk", tags=["Bulk Actions"])

@router.get("/template")
async def get_excel_template():
    """
    تحميل ملف الإكسل (Template) الذي يحتوي على كافة الأعمدة المطلوبة.
    """
    file_stream = generate_product_template()
    return StreamingResponse(
        file_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=pharmacy_template.xlsx"}
    )

@router.post("/upload")
async def upload_products_excel(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    رفع ملف الإكسل لتوزيع البيانات على جميع الجداول (أصناف، مبيعات، مخزون، صور، تاجات).
    """
    if not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(status_code=400, detail="يجب رفع ملف إكسل فقط.")

    content = await file.read()
    result = await process_excel_import(content, db)
    
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
        
    return result