# views.py  (esqueleto)
@csrf_exempt
def echoes(request):
    return JsonResponse([
        dict(id='furia', name='FURIA', avatar='/avatars/furia.svg', lastMessage='', time=''),
        dict(id='fallen', name='FalleN', avatar='/avatars/fallen.jpg', lastMessage='', time=''),
        # ...
    ], safe=False)

@csrf_exempt
def messages(request, eco_id):
    if request.method == 'GET':
        return JsonResponse([], safe=False)   # TODO: carregar do DB
    if request.method == 'POST':
        payload = json.loads(request.body)
        # TODO: salvar mensagem no DB
        return JsonResponse({'ok': True})

@csrf_exempt
def furia_answer(request):
    payload = json.loads(request.body)
    user_prompt = payload['prompt']
    # → aqui você chama seu módulo que usa HLTV snapshot + OpenAI local
    reply = gerar_resposta_furia(user_prompt)
    return JsonResponse({'reply': reply, 'avatar': '/avatars/furia.svg'})
