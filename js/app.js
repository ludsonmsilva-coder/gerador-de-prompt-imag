/* ===== MÓDULOS =====
   Liberar um módulo = trocar false por true. O código dos outros continua aqui. */
const MODULOS={
  img:  {on:true,  label:"Imagem de produto"},
  pessoa:{on:true, label:"Foto de pessoa"},
  video:{on:false, label:"Vídeo"},
};
const ON=Object.keys(MODULOS).filter(k=>MODULOS[k].on);

const $=id=>document.getElementById(id);
const FIELDS=["mode","nome","visual","bonusVis","lang","clips","hook","promessa","benef","oferta","cta","cena","cenaCustom","textMode","audio","darkCta",
  "ai","preset","pGoal","pDesc","pFormat","pFrame","pOutfit","pExpr","pBg","pBgColor","pLight","pLightColor","pRetouch","pVar","pVary","imgFormat","imgStyle","imgAngle","lightColor","imgLight","shadow","bg","bgColor","surface","depth","imgVar","imgVary","imgTextPos","txtTitle","txtSub","txtBadge","txtCta","txtStyle","txtColor","txtBg"];

/* ===== OPÇÕES DE IMAGEM: rótulo, explicação e trecho do prompt ===== */
const BGCOLORS={
  bege:{hex:"#E9DCC8",p:"warm beige",l:"bege"},
  rosa:{hex:"#F2D2D5",p:"soft blush pink",l:"rosa claro"},
  azul:{hex:"#CFE0F2",p:"light sky blue",l:"azul claro"},
  lilas:{hex:"#DCD2F0",p:"pale lilac",l:"lilás"},
  salvia:{hex:"#C3D0BC",p:"muted sage",l:"verde-sálvia"},
  terracota:{hex:"#D3916F",p:"terracotta",l:"terracota"},
  cinza:{hex:"#CBCED3",p:"light grey",l:"cinza"},
  preto:{hex:"#1E1F24",p:"deep black",l:"preto"},
};
const G={
  ai:{label:"IA de imagem",text:true,
    help:"Cada IA entende o prompt de um jeito. Gemini e ChatGPT leem texto corrido e aceitam a sua foto, por isso são as melhores quando o produto ou o rosto precisa ficar igual ao real. Midjourney prefere palavras separadas por vírgula, com o formato no final (--ar). Leonardo e Ideogram têm um campo separado para o que evitar (negative prompt). O gerador monta o prompt no formato de cada uma.",
    opts:{
      gemini:{l:"Gemini",d:"Mantém o produto ou o rosto igual à foto e ajusta conversando. A mais fácil para começar."},
      chatgpt:{l:"ChatGPT",d:"Também mantém bem a foto de referência e escreve texto bem. Gera em quadrado ou retrato 2:3."},
      midjourney:{l:"Midjourney",d:"Imagens mais artísticas, mas não copia o produto nem o rosto com fidelidade. Bom para cenário e conceito."},
      leonardo:{l:"Leonardo",d:"Proporção escolhida na tela e campo separado para o que evitar (negative prompt)."},
      ideogram:{l:"Ideogram",d:"A melhor para escrever texto dentro da imagem."},
      outra:{l:"Outra IA",d:"Prompt genérico para Copilot, Meta AI, Grok, Canva IA, Freepik e outras."},
    }},
  preset:{label:"Tipo de produto",text:true,
    help:"Um atalho. Escolha o tipo do seu produto e o gerador já marca uma combinação de luz, fundo e ângulo que costuma funcionar para ele. Depois você muda o que quiser.",
    opts:{
      beleza:{l:"Beleza / cosmético",d:"Fundo em degradê suave, mármore e luz de estúdio neutra: limpo e com cara de marca premium."},
      comida:{l:"Comida / bebida",d:"Luz de janela amarela, madeira e fundo desfocado: dá sensação de caseiro e apetitoso."},
      roupa:{l:"Roupa / acessório",d:"Flat lay de cima sobre tecido, luz neutra: mostra a peça inteira, sem distorção."},
      eletronico:{l:"Eletrônico",d:"Fundo preto, luz dramática fria e reflexo: passa tecnologia e sofisticação."},
      info:{l:"Ebook / infoproduto",d:"Capa com tablet e celular na madeira, luz de janela: o produto digital fica 'físico'."},
      casa:{l:"Decoração / artesanato",d:"Objetos de casa e artesanato. Ambiente real desfocado, luz quente e tecido: aconchego, mostra o produto em uso."},
      carro:{l:"Carro / veículo",d:"Carro em tamanho real, com os 4 pneus no chão: showroom, estúdio, cidade ou estrada. Nada de mesa, madeira ou mármore."},
      imovel:{l:"Casa / imóvel",d:"Fachada ou ambiente (sala, cozinha, quarto). Linhas retas, céu, horário e decoração. A IA não pode mudar a arquitetura."},
    }},
  imgFormat:{label:"Formato",
    help:"O tamanho da imagem. 4:5 ocupa mais espaço no feed do Instagram. 9:16 é a tela inteira do celular (stories, reels, status). 1:1 é o quadrado, bom para Marketplace e catálogo. Escolha o mesmo formato na IA, se ela tiver essa opção.",
    opts:{"45":{l:"4:5 feed",d:"Vertical, ocupa mais tela no feed do Instagram e Facebook.",p:"vertical 4:5"},
          "916":{l:"9:16 stories",d:"Tela cheia do celular: stories, reels, status do WhatsApp.",p:"vertical 9:16"},
          "11":{l:"1:1 quadrado",d:"Quadrado: Marketplace, catálogo do WhatsApp, Shopee.",p:"square 1:1"}}},
  imgStyle:{label:"Tipo de cena",
    help:"O que aparece na foto além do produto. Destaque mostra só o produto. Em uso mostra mãos segurando, o que ajuda a pessoa a imaginar o tamanho. Com itens monta um kit. Flat lay é a foto tirada de cima, com objetos arrumados em volta.",
    opts:{hero:{l:"Destaque",d:"Só o produto, no centro. O mais seguro para começar.",p:"product hero shot, the product alone as the clear focal point"},
          lifestyle:{l:"Em uso",d:"Mãos segurando o produto. Mostra o tamanho real e gera identificação.",p:"lifestyle scene, the product naturally held by a person's hands, only the hands and forearms visible"},
          bundle:{l:"Com itens",d:"Produto na frente e os itens da oferta em volta. Bom para kits e bônus.",p:"bundle shot, the product in front with the offer items neatly arranged around it"},
          flatlay:{l:"Flat lay",d:"Vista de cima, com objetos arrumados em volta. Muito usado em roupa, papelaria e comida.",p:"flat lay composition seen from directly above, the product and a few related props neatly arranged"}}},
  imgAngle:{label:"Ângulo da câmera",
    help:"De onde a câmera olha o produto. De frente mostra o rótulo sem distorção. 3/4 (um pouco de lado e de cima) dá volume e profundidade, é o ângulo mais comum em anúncio. De cima é para produtos baixos ou flat lay. Close mostra textura e detalhe.",
    opts:{eye:{l:"De frente",d:"Na altura do produto. Rótulo bem legível.",p:"eye-level shot facing the product straight on, 85mm lens"},
          threeq:{l:"3/4",d:"Levemente de lado e de cima. Dá volume. O mais usado em anúncio.",p:"three-quarter view from slightly above, 50mm lens"},
          top:{l:"De cima",d:"Câmera olhando reto para baixo. Para produtos baixos e flat lay.",p:"top-down overhead shot looking straight down"},
          macro:{l:"Close",d:"Bem perto, mostrando textura e detalhe. Ótimo para 2ª ou 3ª imagem.",p:"close-up detail shot, 100mm macro lens, the product filling most of the frame"}}},
  lightColor:{label:"Cor da luz",
    help:"Toda luz tem uma cor, chamada de temperatura e medida em Kelvin (K). Luz neutra (~5000K) é como a luz do dia: as cores do produto saem fiéis. Luz branca/fria (~6500K) puxa para o azul: limpa, técnica, moderna. Luz amarela/quente (~3000K) puxa para o dourado: aconchegante, apetitosa.",
    opts:{neutra:{l:"Neutra",d:"~5000K, luz do dia. Cores fiéis. Escolha esta se estiver em dúvida.",p:"neutral daylight white balance (about 5000K), true-to-life colors"},
          fria:{l:"Branca (fria)",d:"~6500K, puxa para o azul. Limpeza, tecnologia, saúde.",p:"cool white light (about 6500K), crisp, clean and slightly bluish"},
          quente:{l:"Amarela (quente)",d:"~3000K, puxa para o dourado. Comida, café, velas, casa.",p:"warm yellow light (about 3000K), golden and cozy tones"}}},
  imgLight:{label:"Tipo de luz",
    help:"De onde a luz vem e como ela bate. Luz de janela vem de um lado, suave e natural. Estúdio (softbox) vem de frente e de cima, por igual, sem sombras fortes. Contraluz vem de trás e desenha um contorno brilhante. Dramática é um foco só, com o resto escuro.",
    opts:{window:{l:"Janela",d:"Vem de um lado, suave. Natural e caseira.",p:"soft diffused window light coming from the left side, gentle natural falloff"},
          studio:{l:"Estúdio",d:"Softbox de frente e de cima, luz por igual. Cara de e-commerce profissional.",p:"clean studio softbox lighting from the front and above, bright and even"},
          back:{l:"Contraluz",d:"Vem de trás e contorna o produto. Bom para vidro, líquidos e perfume.",p:"backlighting from behind the product, a glowing rim of light outlining its edges"},
          dramatic:{l:"Dramática",d:"Um foco só, resto escuro. Luxo, mistério, eletrônicos.",p:"dramatic low-key lighting, a single spotlight from the upper left, the rest of the scene falling into shadow"}}},
  shadow:{label:"Sombra",
    help:"A sombra mostra que o produto está apoiado em algum lugar. Suave é a mais natural. Marcada aparece com luz forte, como sol direto, e dá um ar de verão e moda. Quase nenhuma deixa o produto 'flutuando', bem limpo, como em loja online.",
    opts:{suave:{l:"Suave",d:"Sombra leve e espalhada. A mais natural.",p:"soft, diffused contact shadow under the product"},
          marcada:{l:"Marcada",d:"Sombra nítida de luz forte, tipo sol. Ar de verão.",p:"crisp, well-defined cast shadow from direct hard light"},
          nenhuma:{l:"Quase nenhuma",d:"Visual limpo de loja online.",p:"almost no shadow, clean floating e-commerce look"}}},
  bg:{label:"Fundo",
    help:"O que fica atrás do produto. Branco infinito é aquele fundo sem canto, como em estúdio, perfeito para catálogo. Cor sólida combina com a cor da marca. Degradê é uma cor que vai clareando. Desfocado deixa manchas de luz borradas. Ambiente coloca o produto num lugar real (cozinha, banheiro, escritório).",
    opts:{white:{l:"Branco infinito",d:"Sem canto nem horizonte. Catálogo e marketplace."},
          solid:{l:"Cor sólida",d:"Uma cor lisa. Combine com a cor da marca ou do produto."},
          gradient:{l:"Degradê",d:"A cor vai clareando. Elegante e moderno."},
          blur:{l:"Desfocado",d:"Manchas de luz borradas (bokeh). Clima de festa ou noite."},
          scene:{l:"Ambiente",d:"Um lugar de verdade, como cozinha ou banheiro. Escolha o cenário abaixo."}}},
  surface:{label:"Onde o produto está apoiado",
    help:"A superfície embaixo do produto muda muito a sensação da foto. Mármore é luxo e beleza. Madeira é natural e caseiro. Tecido é suave e delicado. Pedra é rústico. Espelho cria reflexo, ar tecnológico. Pedestal é aquela base redonda de vitrine.",
    opts:{infinito:{l:"Mesmo do fundo",d:"Sem superfície separada. Visual mais limpo.",p:"the product stands on the same seamless background, no separate surface"},
          marmore:{l:"Mármore",d:"Luxo, beleza, cosméticos.",p:"on a polished white marble surface with subtle grey veins"},
          madeira:{l:"Madeira",d:"Natural e caseiro. Comida, artesanato, livros.",p:"on a natural light wooden table surface with visible grain"},
          tecido:{l:"Tecido",d:"Suave e delicado. Roupa, joia, casa.",p:"on soft draped linen fabric with gentle folds"},
          pedra:{l:"Pedra",d:"Rústico e forte. Produtos masculinos, natureza.",p:"on a rough natural stone slab"},
          espelho:{l:"Espelho",d:"Reflexo do produto. Eletrônicos e perfumes.",p:"on a glossy reflective surface showing a soft mirror reflection of the product"},
          pedestal:{l:"Pedestal",d:"Base redonda de vitrine. Destaca como 'produto premium'.",p:"on a simple round cylindrical pedestal (podium) in a tone matching the background"}}},
  depth:{label:"Foco",
    help:"Fundo desfocado (profundidade de campo rasa) deixa só o produto nítido e o resto borrado: a atenção vai direto para ele. Tudo nítido mostra o cenário inteiro com detalhe, bom para flat lay e catálogo.",
    opts:{desfocado:{l:"Fundo desfocado",d:"Só o produto nítido. A atenção vai para ele.",p:"shallow depth of field, the product tack sharp, background softly blurred"},
          nitido:{l:"Tudo nítido",d:"Cenário inteiro com detalhe. Flat lay e catálogo.",p:"everything in sharp focus, deep depth of field"}}},
};
const PRESETS={
  beleza:{imgStyle:"hero",imgAngle:"eye",lightColor:"neutra",imgLight:"studio",shadow:"suave",bg:"gradient",bgColor:"rosa",surface:"marmore",depth:"desfocado"},
  comida:{imgStyle:"hero",imgAngle:"threeq",lightColor:"quente",imgLight:"window",shadow:"suave",bg:"scene",cena:"kitchen",surface:"madeira",depth:"desfocado"},
  roupa:{imgStyle:"flatlay",imgAngle:"top",lightColor:"neutra",imgLight:"window",shadow:"suave",bg:"solid",bgColor:"bege",surface:"tecido",depth:"nitido"},
  eletronico:{imgStyle:"hero",imgAngle:"threeq",lightColor:"fria",imgLight:"dramatic",shadow:"nenhuma",bg:"solid",bgColor:"preto",surface:"espelho",depth:"desfocado"},
  info:{imgStyle:"bundle",imgAngle:"threeq",lightColor:"neutra",imgLight:"window",shadow:"suave",bg:"scene",cena:"wood",surface:"madeira",depth:"desfocado"},
  casa:{imgStyle:"lifestyle",imgAngle:"threeq",lightColor:"quente",imgLight:"window",shadow:"suave",bg:"scene",cena:"wood",surface:"tecido",depth:"desfocado"},
  carro:{imgStyle:"estatico",imgAngle:"frente34",lightColor:"neutra",imgLight:"studio",shadow:"suave",bg:"showroom",surface:"concreto",depth:"desfocado"},
  imovel:{imgStyle:"fachada",imgAngle:"diagonal",lightColor:"neutra",imgLight:"natural",shadow:"suave",bg:"dia",surface:"arrumar",depth:"nitido"},
};

/* ===== CARRO e IMÓVEL: cada um tem as próprias opções =====
   Carro não pode ficar em madeira, mármore, tecido ou pedestal; imóvel não tem "superfície".
   gOf(s,chave) devolve o grupo certo para o tipo escolhido. */
const KIND_G={
  carro:{
    imgStyle:{label:"Tipo de foto",
      help:"Parado é a foto clássica de anúncio de revenda. Em movimento mostra o carro andando, com as rodas e o fundo borrados (foto 'panning'). Detalhe mostra roda, farol ou grade de perto. Interior mostra painel, volante e bancos.",
      opts:{estatico:{l:"Parado",d:"O carro inteiro, parado. A foto principal do anúncio.",p:"the car parked and standing still as the clear focal point, the whole vehicle in frame"},
            movimento:{l:"Em movimento",d:"Rodas e fundo borrados, carro nítido. Passa velocidade.",p:"the car driving, panning shot: the car body sharp while the wheels and background show motion blur"},
            detalhe:{l:"Detalhe",d:"Roda, farol ou grade de perto. Boa 2ª ou 3ª foto.",p:"close-up detail shot of the car (wheel, headlight and front grille), the paint and materials filling most of the frame"},
            interior:{l:"Interior",d:"Painel, volante e bancos. Mostra acabamento.",p:"interior shot from the center of the back seat looking forward, showing the dashboard, steering wheel, center screen and front seats"}}},
    imgAngle:{label:"Ângulo da câmera",
      help:"3/4 de frente (um pouco de lado) é o ângulo mais usado em anúncio de carro: mostra frente e lateral juntas. Lateral mostra o tamanho e o desenho. 3/4 de trás mostra lanternas e porta-malas. De baixo, com a câmera perto do chão, deixa o carro imponente.",
      opts:{frente34:{l:"3/4 de frente",d:"Frente e lateral juntas. O mais usado em anúncio.",p:"front three-quarter view, camera at headlight height, 35mm lens, the whole car visible"},
            lateral:{l:"Lateral",d:"Perfil completo. Mostra tamanho e desenho.",p:"clean side profile view, camera at door-handle height, 50mm lens, the whole car visible"},
            traseira34:{l:"3/4 de trás",d:"Lanternas e porta-malas. Boa foto complementar.",p:"rear three-quarter view, camera at taillight height, 35mm lens, the whole car visible"},
            frente:{l:"De frente",d:"Centralizado na grade. Simétrico e forte.",p:"straight-on front view centered on the grille, 50mm lens"},
            baixo:{l:"De baixo",d:"Câmera perto do chão. O carro fica imponente.",p:"dramatic low-angle front three-quarter view from close to the ground, 24mm lens, the car looks powerful"}}},
    imgLight:{label:"Tipo de luz",
      help:"Carro é quase um espelho: a luz aparece refletida na lataria. Dia nublado é a luz mais fácil, sem reflexo duro. Estúdio usa um painel grande de luz em cima e desenha uma faixa limpa na lataria. Pôr do sol deixa dourado. Noite usa as luzes da cidade e os faróis acesos. Sol forte marca bem, mas reflete muito.",
      opts:{nublado:{l:"Dia nublado",d:"Luz suave por igual. A mais fácil, sem reflexo duro.",p:"soft even overcast daylight, no harsh reflections on the paint"},
            studio:{l:"Estúdio",d:"Painel grande em cima: faixa de luz limpa na lataria.",p:"large overhead softbox studio lighting, a clean long highlight running along the body"},
            golden:{l:"Pôr do sol",d:"Luz dourada e baixa. Clima premium.",p:"golden-hour sunlight low on the horizon, warm highlights along the body lines"},
            noite:{l:"Noite",d:"Faróis acesos e luzes da cidade refletindo.",p:"night lighting, headlights and taillights on, city lights reflecting on the paint"},
            sol:{l:"Sol forte",d:"Céu limpo e sombra marcada. Reflete bastante.",p:"bright direct midday sunlight, crisp reflections and a defined shadow"}}},
    shadow:{label:"Sombra",
      help:"A sombra embaixo do carro mostra que ele está apoiado no chão, e não flutuando ou colado na imagem. Suave é a mais natural. Marcada aparece com sol forte. Bem leve deixa o visual de catálogo.",
      opts:{suave:{l:"Suave",d:"Sombra natural embaixo do carro.",p:"soft natural contact shadow under the car and around the tires"},
            marcada:{l:"Marcada",d:"Sombra nítida, de sol forte.",p:"crisp cast shadow from direct sunlight"},
            nenhuma:{l:"Bem leve",d:"Só a sombra dos pneus. Visual de catálogo.",p:"very light shadow, only a thin dark contact under the tires"}}},
    bg:{label:"Cenário",
      help:"Onde o carro está. Showroom e estúdio são os mais usados por revenda e concessionária. Cidade à noite e estrada contam uma história e funcionam bem em anúncio de redes sociais. Garagem de casa passa a ideia de 'o carro na sua garagem'.",
      opts:{showroom:{l:"Showroom",d:"Loja clara com vidros. Cara de concessionária.",p:"a bright modern car dealership showroom with large glass windows"},
            estudio:{l:"Estúdio escuro",d:"Fundo preto, painel de luz em cima. Premium.",p:"a dark seamless automotive photo studio with a large overhead light panel"},
            estudioclaro:{l:"Estúdio branco",d:"Fundo branco infinito. Catálogo.",p:"a seamless white automotive studio cyclorama, no visible horizon"},
            solid:{l:"Cor sólida",d:"Estúdio de uma cor. Combine com a marca da loja.",p:""},
            urbano:{l:"Cidade à noite",d:"Rua com luzes desfocadas. Moderno e jovem.",p:"a modern city street at night with softly blurred street lights and building lights"},
            estrada:{l:"Estrada",d:"Estrada aberta com morros. Liberdade, viagem.",p:"an open scenic road curving through green hills under a wide sky"},
            garagem:{l:"Garagem de casa",d:"Na frente de uma casa moderna. 'O carro na sua garagem'.",p:"the driveway in front of a modern house with an open garage"}}},
    surface:{label:"Chão",
      help:"Carro só fica no chão de verdade: asfalto, concreto, piso de estúdio ou terra. Asfalto molhado reflete as luzes e fica lindo à noite. Piso polido de showroom reflete o carro. Estrada de terra combina com caminhonete e SUV. Madeira, mármore e mesa não aparecem aqui porque deixam o carro com cara de miniatura.",
      opts:{asfalto:{l:"Asfalto",d:"Asfalto limpo e seco. Combina com rua e estrada.",p:"clean dry dark asphalt"},
            molhado:{l:"Asfalto molhado",d:"Reflete luzes e o carro. Lindo à noite.",p:"wet dark asphalt with glossy reflections of the car and the lights"},
            concreto:{l:"Piso de showroom",d:"Concreto polido que reflete o carro.",p:"a polished light grey concrete showroom floor with a soft reflection of the car"},
            estudio:{l:"Piso de estúdio",d:"O mesmo do fundo, brilhante, com reflexo.",p:"the seamless glossy studio floor continuing the background, a soft reflection under the car"},
            terra:{l:"Estrada de terra",d:"Caminhonete, SUV e 4x4.",p:"a packed red-earth dirt road with tire tracks"}}},
    depth:{label:"Foco",
      help:"Fundo desfocado deixa só o carro nítido e o resto borrado: a atenção vai direto para ele. Tudo nítido mostra o cenário inteiro, bom para estúdio e showroom.",
      opts:{desfocado:{l:"Fundo desfocado",d:"Só o carro nítido.",p:"shallow depth of field, the car tack sharp, background softly blurred"},
            nitido:{l:"Tudo nítido",d:"Cenário inteiro com detalhe.",p:"everything in sharp focus, deep depth of field"}}},
  },
  imovel:{
    imgStyle:{label:"O que mostrar",
      help:"Fachada é a foto da frente da casa, a primeira do anúncio. Depois venha os ambientes: sala, cozinha, quarto, banheiro e área gourmet. Cada foto mostra um ambiente só.",
      opts:{fachada:{l:"Fachada",d:"A frente da casa. A foto principal do anúncio.",p:"exterior photo of the front facade of the house, the whole building in frame"},
            sala:{l:"Sala",d:"Sala de estar ou TV.",p:"interior photo of the living room"},
            cozinha:{l:"Cozinha",d:"Cozinha, bancada e armários.",p:"interior photo of the kitchen"},
            quarto:{l:"Quarto",d:"Quarto ou suíte.",p:"interior photo of the bedroom"},
            banheiro:{l:"Banheiro",d:"Banheiro ou lavabo.",p:"interior photo of the bathroom"},
            gourmet:{l:"Área gourmet",d:"Churrasqueira, varanda ou piscina.",p:"photo of the outdoor gourmet area with the barbecue grill, covered porch and pool"}}},
    imgAngle:{label:"Ângulo da câmera",
      help:"Foto de imóvel sempre com as linhas das paredes retas, sem inclinar. De frente mostra a fachada ou o ambiente inteiro. Do canto (diagonal) mostra duas paredes e dá sensação de espaço: é o ângulo mais usado por corretor. Drone mostra a casa e o terreno de cima, só para fachada. Detalhe mostra acabamento.",
      opts:{frente:{l:"De frente",d:"Simétrico. Fachada ou ambiente inteiro.",p:"straight-on one-point perspective from the doorway, camera at about 1.2 m height",pExt:"straight-on front view of the facade from across the street, camera at about 1.5 m height"},
            diagonal:{l:"Do canto",d:"Duas paredes. Dá sensação de espaço. O mais usado.",p:"from a corner of the room showing two walls, wide-angle lens, camera at about 1.2 m height",pExt:"three-quarter view of the facade from the corner of the sidewalk, showing the front and one side"},
            drone:{l:"Drone",d:"De cima: casa, terreno e rua. Só para fachada.",p:"high-angle view from an upper corner of the room",pExt:"aerial drone view from about 30 m high at a 45-degree angle, showing the house, the lot and the street"},
            detalhe:{l:"Detalhe",d:"Acabamento de perto: bancada, porta, revestimento.",p:"close-up of a finish detail (countertop, fixtures, flooring)",pExt:"close-up of a facade detail (entrance door, cladding, outdoor lighting)"}}},
    imgLight:{label:"Tipo de luz",
      help:"Natural é a luz do dia entrando pelas janelas, a mais honesta. Luzes acesas liga as luminárias e deixa o ambiente aconchegante. Equilibrada (HDR) é o padrão de foto imobiliária profissional: o ambiente fica claro e a vista da janela aparece, sem ficar estourada de branco.",
      opts:{natural:{l:"Natural",d:"Luz do dia. A mais honesta.",p:"bright natural daylight coming through the windows, interior lamps off",pExt:"bright natural sunlight on the facade"},
            acesas:{l:"Luzes acesas",d:"Luminárias ligadas. Aconchego.",p:"natural daylight balanced with all ceiling and accent lights turned on, warm cozy glow",pExt:"all exterior and interior lights turned on, warm glow from every window"},
            hdr:{l:"Equilibrada (HDR)",d:"Ambiente claro e janela sem estourar. Padrão profissional.",p:"balanced HDR exposure: bright interior and the view through the windows both clearly visible, no blown-out windows",pExt:"balanced HDR exposure, no harsh shadows, sky and facade both well exposed"}}},
    bg:{label:"Céu e horário",
      help:"Na fachada, o céu muda tudo: céu azul é o padrão de anúncio. Fim de tarde deixa dourado. Anoitecer, com as luzes da casa acesas, é a foto que mais chama atenção. Nos ambientes internos, o horário aparece pela janela.",
      opts:{dia:{l:"Céu azul",d:"Dia limpo. O padrão de anúncio.",p:"a clear blue sky with a few soft white clouds, midday"},
            golden:{l:"Fim de tarde",d:"Sol baixo e dourado.",p:"golden hour, warm low sun and a soft orange and pink sky"},
            noite:{l:"Anoitecer",d:"Céu azul-escuro com a casa iluminada. Chama atenção.",p:"blue hour twilight, a deep blue sky just after sunset"},
            nublado:{l:"Nublado claro",d:"Luz suave, sem sombra dura.",p:"a soft bright overcast sky"}}},
    surface:{label:"Decoração / paisagismo",
      help:"Manter deixa tudo como está na foto, só melhora a luz. Só arrumar tira bagunça, fios e objetos pessoais. Decorar mobilia o ambiente vazio (home staging) ou faz o jardim na fachada. Ambiente vazio tira os móveis. Se a IA decorar ou esvaziar, avise no anúncio que é imagem ilustrativa.",
      opts:{manter:{l:"Manter como está",d:"Mesmos móveis e jardim. Só melhora luz e cor.",p:"keep the existing furniture and decor exactly as in the photo, only cleaner and better lit",pExt:"keep the existing garden and landscaping exactly as in the photo, only tidier"},
            arrumar:{l:"Só arrumar",d:"Tira bagunça, fios e objetos pessoais.",p:"same furniture, but decluttered: remove personal items, cables, clothes and clutter, bed made, surfaces clear",pExt:"same landscaping, tidied: lawn trimmed, no trash, no hoses, no parked cars, clean sidewalk"},
            decorar:{l:"Decorar",d:"Mobilia o ambiente (home staging) ou faz o jardim.",p:"tastefully furnished and staged with modern neutral furniture, a rug, plants, cushions and soft decor",pExt:"well-kept landscaping: trimmed green lawn, palm trees, flower beds and garden lights"},
            vazio:{l:"Ambiente vazio",d:"Sem móveis. Mostra o espaço real.",p:"completely empty and clean room, no furniture or objects",pExt:"clean facade, no cars, no people, simple trimmed lawn"}}},
  },
};
const KIND_HIDE={imovel:["shadow","depth"],carro:[],produto:[]};
const KIND_NOUN={produto:"produto",carro:"carro",imovel:"imóvel"};
const kindOf=s=>(s.preset==="carro"||s.preset==="imovel")?s.preset:"produto";
const gOf=(s,k)=>((KIND_G[kindOf(s)]||{})[k])||G[k];
const PROD_DEF={imgStyle:"hero",imgAngle:"threeq",imgLight:"window",shadow:"suave",bg:"white",surface:"infinito",depth:"desfocado"};
/* Corrige escolhas que não existem para o tipo (ex.: carro com mármore vindo de um aprovado antigo). Devolve o que trocou. */
function normalizeKind(s){
  const k=kindOf(s), def=k==="produto"?PROD_DEF:PRESETS[k], fixed=[];
  ["imgStyle","imgAngle","imgLight","shadow","bg","surface","depth"].forEach(key=>{
    const g=gOf(s,key);
    if(!g.opts[s[key]]){const old=s[key];s[key]=def[key];const el=$(key);if(el)el.value=def[key];if(old)fixed.push([key,old])}
  });
  return fixed;
}
const OLD_L={marmore:"mármore",madeira:"madeira",tecido:"tecido",pedra:"pedra",espelho:"espelho",pedestal:"pedestal",infinito:"mesmo do fundo"};

/* ===== FOTO DE PESSOA: opções ===== */
Object.assign(G,{
  pGoal:{label:"Objetivo",text:true,
    help:"Um atalho. Escolha para que vai usar a foto e o gerador marca enquadramento, roupa, fundo e luz que combinam. Depois você muda o que quiser.",
    opts:{
      linkedin:{l:"Perfil profissional",d:"LinkedIn, currículo, crachá. Rosto e ombros, blazer, fundo de estúdio.",p:"a professional headshot for LinkedIn and a résumé"},
      redes:{l:"Instagram / WhatsApp",d:"Foto de perfil leve e simpática, fundo verde desfocado.",p:"a friendly profile picture for Instagram and WhatsApp"},
      autoridade:{l:"Página de vendas",d:"Meio corpo, casual elegante, escritório ao fundo. Passa autoridade.",p:"an authority portrait for a sales page and social media posts"},
      ensaio:{l:"Ensaio estilo revista",d:"Luz dramática, fundo escuro, olhar confiante.",p:"an editorial magazine-style portrait"},
      melhorar:{l:"Só melhorar a foto",d:"Mantém roupa, fundo e expressão. Só corrige luz, nitidez e cor.",p:"the same photo, only improved: better light, sharpness and color, nothing else changed"},
    }},
  pFormat:{label:"Formato",draw:"p",help:G.imgFormat.help,opts:G.imgFormat.opts},
  pFrame:{label:"Enquadramento",draw:"p",
    help:"Quanto da pessoa aparece. Rosto e ombros (headshot) é o padrão para foto de perfil. Meio corpo mostra a roupa e as mãos, bom para página de vendas. Corpo inteiro só fica fiel se a foto original também mostrar o corpo todo.",
    opts:{rosto:{l:"Rosto e ombros",d:"Headshot. Padrão para foto de perfil.",p:"head-and-shoulders headshot"},
          meio:{l:"Meio corpo",d:"Da cintura para cima. Mostra a roupa e as mãos.",p:"waist-up portrait"},
          inteiro:{l:"Corpo inteiro",d:"Precisa de uma foto original de corpo inteiro.",p:"full-body portrait"}}},
  pOutfit:{label:"Roupa",draw:"p",
    help:"A roupa muda como as pessoas te enxergam. Blazer passa seriedade, camisa social passa profissionalismo, casual elegante passa proximidade com autoridade, camiseta lisa passa simplicidade. Para ficar mais fiel à pessoa real, mantenha a roupa da foto.",
    opts:{manter:{l:"Manter a da foto",d:"A mais fiel. Só melhora o caimento e as cores.",p:"keep exactly the same clothes as in the original photo"},
          blazer:{l:"Blazer escuro",d:"Seriedade. Advogados, contadores, consultores.",p:"dressed in a well-fitted dark navy blazer over a plain white shirt"},
          social:{l:"Camisa social",d:"Profissional sem ser formal demais.",p:"dressed in a crisp light blue button-up shirt"},
          casual:{l:"Casual elegante",d:"Próximo e com autoridade. Criadores e empreendedores.",p:"dressed in a smart casual neutral beige knit sweater"},
          basica:{l:"Camiseta lisa",d:"Simples e moderno.",p:"dressed in a plain fitted dark grey t-shirt"}}},
  pExpr:{label:"Expressão",draw:"p",
    help:"Sorriso leve passa confiança e simpatia, bom para perfil. Sério e confiante combina com ensaio e autoridade. Manter a original é o mais fiel.",
    opts:{manter:{l:"Manter a original",d:"Mais fiel à pessoa.",p:"keep the original facial expression"},
          sorriso:{l:"Sorriso leve",d:"Simpatia e confiança.",p:"a gentle, natural closed-mouth smile"},
          confiante:{l:"Sério e confiante",d:"Ensaio e autoridade.",p:"a calm, serious and confident expression"}}},
  pBg:{label:"Fundo",draw:"p",
    help:"O fundo pode tirar a atenção ou ajudar a contar quem você é. Estúdio cinza e branco são os clássicos de foto profissional. Escritório e cidade desfocados mostram contexto sem roubar a cena. Manter o original deixa a foto mais natural.",
    opts:{manter:{l:"Manter o original",d:"Só deixa mais limpo e bem iluminado.",p:"keep the original background, only cleaner and better lit"},
          estudio:{l:"Estúdio cinza",d:"O clássico de foto profissional.",p:"a seamless medium grey studio backdrop with a soft light falloff behind the head"},
          branco:{l:"Branco",d:"Crachá, site, documento.",p:"a clean seamless white studio background"},
          cor:{l:"Cor sólida",d:"Escolha a cor abaixo. Combine com a sua marca.",p:""},
          escritorio:{l:"Escritório",d:"Escritório claro desfocado. Contexto profissional.",p:"a modern bright office softly blurred behind the person"},
          externo:{l:"Ar livre",d:"Árvores desfocadas e luz natural. Leve e simpático.",p:"an outdoor park with green trees softly blurred behind the person"},
          cidade:{l:"Cidade",d:"Luzes da cidade desfocadas. Urbano e moderno.",p:"a city street at dusk with soft bokeh lights blurred behind the person"}}},
  pLightColor:{label:"Cor da luz",draw:"p",help:G.lightColor.help,opts:G.lightColor.opts},
  pLight:{label:"Tipo de luz",draw:"p",
    help:"Janela é suave e natural, vinda de um lado. Estúdio (softbox) ilumina por igual, sem sombras fortes no rosto: é o padrão de foto profissional. Pôr do sol é dourado, vindo de trás, com brilho no cabelo. Dramática (luz Rembrandt) ilumina um lado do rosto e deixa o outro na sombra.",
    opts:{janela:{l:"Janela",d:"Suave e natural, de um lado.",p:"soft window light from the side, gentle natural shadows on the face"},
          estudio:{l:"Estúdio",d:"Por igual, sem sombras fortes. Padrão profissional.",p:"professional studio lighting with a large softbox, even and flattering light on the face, catchlights in the eyes"},
          golden:{l:"Pôr do sol",d:"Dourado, com brilho no cabelo. Para ar livre.",p:"golden-hour sunlight from behind, warm rim light on the hair and shoulders"},
          dramatica:{l:"Dramática",d:"Um lado do rosto na sombra. Ensaio.",p:"dramatic Rembrandt lighting, one side of the face lit and the other in soft shadow"}}},
  pRetouch:{label:"Retoque de pele",text:true,
    help:"Retoque demais deixa a pele com cara de plástico e a pessoa não se reconhece. Natural mantém a textura, as pintas e as marcas, só acerta luz e cor. Leve tira o brilho e suaviza olheiras. Nenhum deixa a pele como está.",
    opts:{natural:{l:"Natural",d:"Mantém textura, pintas e marcas. Recomendado.",p:"natural retouch only: keep real skin texture, pores, freckles and marks; just even out lighting and color"},
          leve:{l:"Leve",d:"Tira o brilho e suaviza olheiras.",p:"light retouch: reduce shine and soften under-eye shadows slightly, keep real skin texture"},
          nenhum:{l:"Nenhum",d:"Pele exatamente como está.",p:"no skin retouching at all"}}},
});
const P_PRESETS={
  linkedin:{pFormat:"11",pFrame:"rosto",pOutfit:"blazer",pExpr:"sorriso",pBg:"estudio",pLight:"estudio",pLightColor:"neutra",pRetouch:"natural"},
  redes:{pFormat:"11",pFrame:"rosto",pOutfit:"manter",pExpr:"sorriso",pBg:"externo",pLight:"janela",pLightColor:"quente",pRetouch:"natural"},
  autoridade:{pFormat:"45",pFrame:"meio",pOutfit:"casual",pExpr:"confiante",pBg:"escritorio",pLight:"janela",pLightColor:"neutra",pRetouch:"natural"},
  ensaio:{pFormat:"45",pFrame:"meio",pOutfit:"basica",pExpr:"confiante",pBg:"cor",pBgColor:"preto",pLight:"dramatica",pLightColor:"neutra",pRetouch:"leve"},
  melhorar:{pOutfit:"manter",pExpr:"manter",pBg:"manter",pLight:"janela",pLightColor:"neutra",pRetouch:"natural"},
};

/* ===== TEXTO NA IMAGEM (produto e pessoa) ===== */
Object.assign(G,{
  textMode:{label:"Quer texto na imagem?",draw:"t",
    help:"Sem texto: a imagem sai só com a foto. Eu coloco no Canva: a IA deixa um espaço vazio no lugar que você escolher e você escreve depois, com a fonte que quiser, sem risco de letra errada. A IA escreve: o texto já sai pronto na imagem, mas confira cada letra e acento.",
    opts:{none:{l:"Sem texto",d:"Só a foto. A imagem sai limpa, sem espaço reservado."},
          edit:{l:"Eu coloco no Canva",d:"A IA deixa um espaço vazio. Você escreve depois, sem risco de letra errada."},
          gemini:{l:"A IA escreve",d:"O texto já sai pronto na imagem. Confira cada letra antes de usar."}}},
  txtParts:{label:"Quais textos vão na imagem",text:true,multi:true,
    help:"Ligue só o que você vai usar. Título é a frase grande. Subtítulo é uma linha menor que explica. Selo é o círculo de oferta, como 50% OFF ou Frete grátis. Botão é a chamada para ação, como Compre agora. Quanto menos texto, mais limpa fica a imagem e menos a IA erra.",
    opts:{txtTitle:{l:"Título"},txtSub:{l:"Subtítulo"},txtBadge:{l:"Selo"},txtCta:{l:"Botão"}}},
  imgTextPos:{label:"Onde fica o texto",draw:"t",
    help:"O texto precisa de um espaço vazio para ficar legível. Em cima é o mais usado no feed. Embaixo funciona bem em stories e reels, porque o topo fica coberto pelo nome do perfil. Nas laterais, o produto ou a pessoa vai para o outro lado.",
    opts:{top:{l:"Em cima",d:"O mais usado no feed.",p:"upper third"},
          bottom:{l:"Embaixo",d:"Bom para stories e reels.",p:"lower third"},
          left:{l:"À esquerda",d:"O produto ou a pessoa vai para a direita.",p:"left half"},
          right:{l:"À direita",d:"O produto ou a pessoa vai para a esquerda.",p:"right half"}}},
  txtStyle:{label:"Estilo da letra",draw:"t",
    help:"Cada estilo passa uma sensação. Moderna serve para quase tudo. Elegante combina com beleza, joias e moda. Manuscrita é delicada, boa para doces, presentes e artesanato, mas só em frase curta. Impacto é para promoção e oferta. Divertida combina com infantil, comida e pet. Embaixo aparece a fonte parecida no Canva.",
    opts:{moderna:{l:"Moderna",d:"Serve para quase tudo. No Canva: Montserrat Bold.",p:"a bold modern geometric sans-serif font",f:"Montserrat, 'Arial Black', sans-serif",w:800,canva:"Montserrat Bold"},
          elegante:{l:"Elegante",d:"Beleza, joias e moda. No Canva: Playfair Display.",p:"an elegant high-contrast serif font",f:"'Playfair Display', Georgia, serif",w:700,canva:"Playfair Display"},
          manuscrita:{l:"Manuscrita",d:"Doces, presentes, artesanato. Só frase curta. No Canva: Dancing Script.",p:"a flowing handwritten script font",f:"'Dancing Script', 'Brush Script MT', cursive",w:700,canva:"Dancing Script"},
          impacto:{l:"Impacto",d:"Promoção e oferta. No Canva: Bebas Neue.",p:"a tall condensed all-caps impact font",f:"'Barlow Condensed', 'Arial Narrow', sans-serif",w:800,up:true,canva:"Bebas Neue"},
          divertida:{l:"Divertida",d:"Infantil, comida e pet. No Canva: Fredoka.",p:"a friendly rounded playful font",f:"Fredoka, 'Arial Rounded MT Bold', sans-serif",w:600,canva:"Fredoka"}}},
  txtColor:{label:"Cor do texto",draw:"t",
    help:"O texto precisa contrastar com o fundo: letra clara em fundo escuro, letra escura em fundo claro. Automática deixa a IA escolher. Cor do produto puxa a cor principal da embalagem ou da roupa e deixa tudo combinando.",
    opts:{auto:{l:"Automática",d:"A IA escolhe a cor com melhor contraste.",p:"in whatever color gives the best contrast with the background"},
          branco:{l:"Branco",d:"Para fundo escuro ou foto colorida.",p:"in white",hex:"#FFFFFF"},
          preto:{l:"Preto",d:"Para fundo claro.",p:"in near-black",hex:"#15191E"},
          dourado:{l:"Dourado",d:"Luxo e elegância. Melhor em fundo escuro.",p:"in elegant gold",hex:"#D8B26A"},
          marca:{l:"Cor do produto",d:"Combina o texto com o produto ou a roupa.",p:"in the main color of the product"}}},
  txtBg:{label:"Fundo atrás do texto",draw:"t",
    help:"Se a foto tem muitos detalhes atrás, o texto some. Uma faixa, uma caixa ou uma sombra atrás da letra resolve. Em fundo liso, sem fundo fica mais limpo.",
    opts:{nenhum:{l:"Sem fundo",d:"Direto na foto. Melhor em fundo liso.",p:"placed directly on the image with no box behind it"},
          faixa:{l:"Faixa",d:"Tarja de ponta a ponta. Lê bem em qualquer foto.",p:"on a solid color band that spans the full width of the image"},
          caixa:{l:"Caixa",d:"Retângulo arredondado atrás do texto. Moderno.",p:"inside a rounded rectangle box"},
          sombra:{l:"Sombra",d:"Sombra leve na letra. Discreto.",p:"with a soft drop shadow behind the letters for legibility"}}},
});
const TXT_KEYS=["textMode","txtParts","imgTextPos","txtStyle","txtColor","txtBg"];
const IMG_KEYS=["ai","preset","imgFormat","imgStyle","imgAngle","lightColor","imgLight","shadow","bg","surface","depth",...TXT_KEYS];
const P_KEYS=["ai","pGoal","pFormat","pFrame","pOutfit","pExpr","pBg","pLightColor","pLight","pRetouch",...TXT_KEYS];

function txtOf(s,ph){
  const on=k=>s.mode==="video"||s[k]==="1";
  const g=(k,v,p)=>on(k)?(clean(v)||(ph?p:"")):"";
  return {h:g("txtTitle",s.hook,"Seu título aqui"),sub:g("txtSub",s.promessa,"Subtítulo menor"),badge:g("txtBadge",s.oferta,"50% OFF"),cta:g("txtCta",s.cta,"Compre agora")};
}
function wrapTxt(t,per,max){
  const out=[];let cur="";
  t.split(/\s+/).filter(Boolean).forEach(w=>{if(!cur)cur=w;else if((cur+" "+w).length<=per)cur+=" "+w;else{out.push(cur);cur=w}});
  if(cur)out.push(cur);
  if(out.length>max){out.length=max;out[max-1]=out[max-1].slice(0,per-1)+"…"}
  return out;
}
function txtHex(s,darkBg,brand){
  if(s.txtColor==="auto")return darkBg?"#FFFFFF":"#15191E";
  if(s.txtColor==="marca")return brand;
  return (G.txtColor.opts[s.txtColor]||{}).hex||"#15191E";
}
function zoneFor(s,W,H){
  return {top:{x:4,y:3,w:92,h:H*.3},bottom:{x:4,y:H*.68,w:92,h:H*.3},left:{x:3,y:H*.1,w:46,h:H*.8},right:{x:51,y:H*.1,w:46,h:H*.8}}[s.imgTextPos]||{x:4,y:3,w:92,h:H*.3};
}
function textOverlay(s,W,H,z,o){
  if(s.textMode==="none")return "";
  const tc0=o.darkBg?"#FFFFFF":"#15191E";
  if(s.textMode!=="gemini")return `<rect x="${z.x}" y="${z.y}" width="${z.w}" height="${z.h}" rx="2" fill="${tc0}" fill-opacity=".06" stroke="${tc0}" stroke-width=".6" stroke-dasharray="2 1.5" opacity=".8"/><text x="${z.x+z.w/2}" y="${z.y+z.h/2+1.6}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-weight="600" font-size="4.6" fill="${tc0}" opacity=".85">texto no Canva</text>`;
  const T=txtOf(s,true), st=G.txtStyle.opts[s.txtStyle]||G.txtStyle.opts.moderna, tc=txtHex(s,o.darkBg,o.brand);
  const side=z.w<60, fsT=side?8:9.5, fsS=side?4.2:4.8;
  const cw=st.up?.58:(s.txtStyle==="manuscrita"?.52:.62);
  const lines=T.h?wrapTxt(st.up?T.h.toUpperCase():T.h,Math.max(6,Math.floor((z.w-6)/(fsT*cw))),3):[];
  const subL=T.sub?wrapTxt(T.sub,Math.floor((z.w-6)/(fsS*.52)),2):[];
  const cx=z.x+z.w/2;
  const blockH=lines.length*fsT*1.05+(subL.length?subL.length*fsS*1.25+1.5:0)+(T.cta?11:0);
  const top=z.y+Math.max(1,(z.h-blockH)/2);
  let y=top+fsT*.82, out="";
  const light=["#FFFFFF","#D8B26A"].includes(tc), panel=light?"#15191E":"#FFFFFF";
  const sh=s.txtBg==="sombra"?` filter="url(#${o.id}ts)"`:"";
  if(s.txtBg==="faixa")out+=`<rect x="${side?z.x-3:0}" y="${top-3}" width="${side?z.w+6:W}" height="${blockH+5}" fill="${panel}" opacity=".88"/>`;
  if(s.txtBg==="caixa")out+=`<rect x="${z.x+2}" y="${top-3}" width="${z.w-4}" height="${blockH+5}" rx="3.5" fill="${panel}" opacity=".9"/>`;
  lines.forEach(l=>{out+=`<text x="${cx}" y="${y}" text-anchor="middle" font-family="${st.f}" font-weight="${st.w}" font-size="${fsT}" fill="${tc}"${sh}>${esc(l)}</text>`;y+=fsT*1.05});
  if(subL.length){y+=1.5-fsT*.25+fsS*.6;subL.forEach(l=>{out+=`<text x="${cx}" y="${y}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-weight="500" font-size="${fsS}" fill="${tc}"${sh}>${esc(l)}</text>`;y+=fsS*1.25});}
  if(T.cta){const bw=Math.min(z.w-8,T.cta.length*2.5+12), by=y-fsS*.5+1.5;out+=`<rect x="${cx-bw/2}" y="${by}" width="${bw}" height="8" rx="4" fill="#E8743B"/><text x="${cx}" y="${by+5.5}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-weight="600" font-size="4.2" fill="#fff">${esc(T.cta)}</text>`;}
  if(T.badge){
    const bx=s.imgTextPos==="right"?13:W-13, byy=s.imgTextPos==="top"?Math.min(H-13,z.y+z.h+12):13;
    const bl=wrapTxt(T.badge,9,2), fs=bl.length>1?3.6:(T.badge.length>7?3.8:4.6);
    out+=`<circle cx="${bx}" cy="${byy}" r="10.5" fill="#D7263D"/>`+bl.map((l,i)=>`<text x="${bx}" y="${byy+1.5+(i-(bl.length-1)/2)*4.2}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-weight="700" font-size="${fs}" fill="#fff">${esc(l)}</text>`).join("");
  }
  return out;
}
const TS_FILTER=id=>`<filter id="${id}ts" x="-20%" y="-50%" width="140%" height="200%"><feDropShadow dx=".4" dy=".6" stdDeviation=".7" flood-color="#000" flood-opacity=".7"/></filter>`;
function drawTextThumb(s,key,v){
  const ov={...s,[key]:v};
  if(key==="textMode"||key==="imgTextPos"){
    if(key==="imgTextPos"&&ov.textMode==="none")ov.textMode="edit";
    return s.mode==="pessoa"?drawPerson({...ov,pFormat:"11"},{thumb:true,noIcon:true,withText:true}):drawScene({...ov,imgFormat:"11"},{thumb:true,noIcon:true,withText:true});
  }
  const id="t"+(UID++), st=G.txtStyle.opts[ov.txtStyle]||G.txtStyle.opts.moderna, word=st.up?"OFERTA":"Oferta";
  let bg, dark;
  if(key==="txtStyle"){bg=`<rect width="100" height="64" fill="#F3F1EC"/>`;dark=false}
  else if(key==="txtColor"){bg=`<rect width="100" height="64" fill="#6E655D"/><circle cx="18" cy="14" r="16" fill="#8C7F72"/><circle cx="86" cy="54" r="18" fill="#4E4741"/>`;dark=true}
  else {bg=`<rect width="100" height="64" fill="#C9B9A6"/>${[[12,10,"#F2E8DA"],[34,52,"#7D6A58"],[58,14,"#FFFFFF"],[80,40,"#93806C"],[94,8,"#E8DCCB"],[50,40,"#B19E88"]].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="13" fill="${c}"/>`).join("")}`;dark=false}
  const tc=txtHex(ov,dark,s.mode==="pessoa"?(OUTFIT[s.pOutfit]||"#3D4A66"):"#3D4A66");
  const fs=key==="txtStyle"&&st.up?24:21, light=["#FFFFFF","#D8B26A"].includes(tc), panel=light?"#15191E":"#FFFFFF";
  let deco="";
  if(key==="txtBg"&&ov.txtBg==="faixa")deco=`<rect x="0" y="19" width="100" height="27" fill="${panel}" opacity=".88"/>`;
  if(key==="txtBg"&&ov.txtBg==="caixa")deco=`<rect x="12" y="18" width="76" height="29" rx="6" fill="${panel}" opacity=".9"/>`;
  const sh=key==="txtBg"&&ov.txtBg==="sombra"?` filter="url(#${id}ts)"`:"";
  return `<svg viewBox="0 0 100 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Amostra"><defs>${TS_FILTER(id)}</defs>${bg}${deco}<text x="50" y="40" text-anchor="middle" font-family="${st.f}" font-weight="${st.w}" font-size="${fs}" fill="${tc}"${sh}>${word}</text></svg>`;
}
function textSummary(s){
  if(s.textMode==="none")return "Sem texto";
  const pos=G.imgTextPos.opts[s.imgTextPos].l.toLowerCase();
  if(s.textMode!=="gemini")return `Espaço para o Canva, ${pos}`;
  return `${G.txtStyle.opts[s.txtStyle].l}, ${pos}, ${G.txtBg.opts[s.txtBg].l.toLowerCase()}`;
}
function txtZoneInfo(s){
  const pos=s.imgTextPos||"top", T=txtOf(s,false);
  return {textZone:G.imgTextPos.opts[pos].p,prodZone:{top:"lower two thirds",bottom:"upper two thirds",left:"right half",right:"left half"}[pos],
    space:s.textMode!=="none",h:T.h,sub:T.sub,badge:T.badge,cta:T.cta,wantText:s.textMode==="gemini"&&!!(T.h||T.sub||T.badge||T.cta)};
}
function textLines(s,x){
  const L=LANG[s.lang];
  if(s.textMode==="none")return [`TEXT: none. Do not add any text, letters or logos to the image.`];
  if(!x.wantText)return [`TEXT: none. Leave the ${x.textZone} as clean, empty negative space for text added later.`];
  const st=G.txtStyle.opts[s.txtStyle], co=G.txtColor.opts[s.txtColor], tb=G.txtBg.opts[s.txtBg];
  const P=[`TEXT ON IMAGE (${L}, spell exactly as written, keep every accent), placed in the ${x.textZone}, set in ${st.p}, ${co.p}, ${tb.p}:`];
  if(x.h)P.push(`  Title, large${st.up?", all caps":""}: "${x.h}"`);
  if(x.sub)P.push(`  Subtitle below the title, smaller and lighter: "${x.sub}"`);
  if(x.badge)P.push(`  Round badge in a corner, bold contrasting color: "${x.badge}"`);
  if(x.cta)P.push(`  Rounded button below the text: "${x.cta}"`);
  P.push(`  No other text anywhere in the image.`);
  return P;
}
function textChecks(s,busy){
  const C=[], T=txtOf(s,false), total=[T.h,T.sub,T.badge,T.cta].filter(Boolean);
  if(s.textMode==="none")return C;
  if(s.textMode==="gemini"){
    if(!total.length)C.push(["warn","Você escolheu “A IA escreve”, mas nenhum texto está ligado e preenchido."]);
    if(words(T.h)>7)C.push(["warn",`Título com ${words(T.h)} palavras. Acima de 7 a IA erra mais letras e a frase fica pequena no feed.`]);
    if(words(total.join(" "))>20)C.push(["warn","Muito texto para a IA escrever. Deixe o título e mais um elemento, ou coloque o resto no Canva."]);
    if(total.length){
      if(s.ai==="ideogram")C.push(["ok","Ideogram é a melhor para texto na imagem. Mesmo assim, confira acentos e letras."]);
      else if(s.ai==="gemini"||s.ai==="chatgpt")C.push(["ok","Texto pela IA: confira acentos e letras. Se errar, peça na conversa “corrija o texto para …” em vez de gerar de novo."]);
      else C.push(["warn","Texto dentro da imagem é o ponto fraco dessa IA. Confira cada letra ou coloque o texto no Canva."]);
    }
    if(s.ai==="midjourney"&&(T.sub||T.badge||T.cta))C.push(["warn","No Midjourney só o título vai no prompt. Subtítulo, selo e botão coloque no Canva."]);
    if(s.txtStyle==="manuscrita"&&words(T.h)>5)C.push(["warn","Letra manuscrita fica difícil de ler em frase longa. Use até 5 palavras ou troque para Moderna."]);
    if(busy&&s.txtBg==="nenhum")C.push(["warn","O fundo da foto tem muitos detalhes e o texto está sem fundo. Use Faixa, Caixa ou Sombra para ler melhor."]);
  } else C.push(["ok",`Texto fica para o Canva: a imagem sai com o espaço livre, sem risco de letra errada. Fonte sugerida: ${G.txtStyle.opts[s.txtStyle].canva}.`]);
  total.forEach(t=>{
    if(s.lang==="es"&&t.includes("?")&&!t.includes("¿"))C.push(["warn",`Falta o "¿" de abertura em "${t}".`]);
    if(s.lang==="es"&&/\b(você|não|ção)\b/i.test(t))C.push(["warn",`Parece português no texto em espanhol: "${t}".`]);
  });
  return C;
}

/* prévia da pessoa */
const SKIN="#D9A47E", HAIR="#3A2A20";
const OUTFIT={manter:"#5F7A99",blazer:"#262B36",social:"#BFD3EA",casual:"#CDB894",basica:"#4A4E57"};
function drawPerson(s,o={}){
  const id="p"+(UID++), W=100, H=FMT_H[s.pFormat]||100;
  const bgc=(BGCOLORS[s.pBgColor]||BGCOLORS.azul).hex, bl=`filter="url(#${id}b)"`;
  let bg="";
  switch(s.pBg){
    case "estudio":bg=`<rect width="${W}" height="${H}" fill="#868C95"/><ellipse cx="50" cy="${H*.38}" rx="40" ry="${H*.34}" fill="#B9BEC5" ${bl}/>`;break;
    case "branco":bg=`<rect width="${W}" height="${H}" fill="#F7F7F5"/>`;break;
    case "cor":bg=`<rect width="${W}" height="${H}" fill="${bgc}"/><ellipse cx="50" cy="${H*.38}" rx="38" ry="${H*.32}" fill="${shade(bgc,.18)}" ${bl}/>`;break;
    case "escritorio":bg=`<rect width="${W}" height="${H}" fill="#E1E5E9"/><g ${bl}><rect x="4" y="${H*.06}" width="34" height="${H*.48}" fill="#FAFBFC"/><line x1="21" y1="${H*.06}" x2="21" y2="${H*.54}" stroke="#B9C0C9" stroke-width="1.5"/><rect x="66" y="${H*.14}" width="30" height="${H*.05}" fill="#AEB6C0"/><rect x="66" y="${H*.3}" width="30" height="${H*.05}" fill="#AEB6C0"/><ellipse cx="86" cy="${H*.62}" rx="9" ry="${H*.14}" fill="#7E9A72"/></g>`;break;
    case "externo":bg=`<rect width="${W}" height="${H}" fill="#9DBB8C"/><g ${bl}>${[[12,.2,14,"#6F9460"],[80,.15,16,"#5E8551"],[45,.05,12,"#C9DDB0"],[92,.5,12,"#7FA56D"],[6,.6,13,"#B8D29E"],[65,.4,8,"#E7F0D2"]].map(([x,y,r,c])=>`<circle cx="${x}" cy="${H*y}" r="${r}" fill="${c}"/>`).join("")}</g>`;break;
    case "cidade":bg=`<rect width="${W}" height="${H}" fill="#2F3747"/><g ${bl}>${[[10,.2,"#F5C26B"],[28,.35,"#E88F6A"],[76,.18,"#9DB7E0"],[90,.42,"#F5C26B"],[60,.08,"#F2E2B8"],[16,.55,"#9DB7E0"],[84,.65,"#E88F6A"]].map(([x,y,c],i)=>`<circle cx="${x}" cy="${H*y}" r="${4+i%3*2}" fill="${c}" opacity=".85"/>`).join("")}</g>`;break;
    default:bg=`<rect width="${W}" height="${H}" fill="#CBBFB0"/><g ${bl}><rect x="62" y="${H*.08}" width="32" height="${H*.5}" fill="#AE9F8A"/><circle cx="18" cy="${H*.28}" r="11" fill="#E4DACB"/><rect x="0" y="${H*.7}" width="100" height="${H*.3}" fill="#B3A592"/></g>`;
  }
  const win={rosto:[-17,30],meio:[-17,60],inteiro:[-15,114]}[s.pFrame]||[-17,30];
  const sc=Math.min(H*.9/(win[1]-win[0]),2.0);
  const ty=(s.pFrame==="inteiro"?H*.97:H)-win[1]*sc;
  const showText=(!o.thumb||o.withText)&&!o.noText&&s.textMode!=="none", tpos=s.imgTextPos||"top";
  let fx=50, fty=ty, fsc=sc;
  if(showText){
    if(tpos==="top")fty=ty+H*.24;
    if(tpos==="left"||tpos==="right"){fsc=sc*.85;fx=tpos==="left"?67:33;fty=(s.pFrame==="inteiro"?H*.97:H)-win[1]*fsc}
  }
  const oc=OUTFIT[s.pOutfit]||OUTFIT.manter;
  let f=`<path d="M-12 54 L-11 112 L-2 112 L-1 62 L1 62 L2 112 L11 112 L12 54 Z" fill="#2F3440"/>`;
  f+=`<path d="M-16 14 Q-23 17 -23 30 L-22 52 L-17 52 L-16 28 Z" fill="${shade(oc,-.12)}"/><path d="M16 14 Q23 17 23 30 L22 52 L17 52 L16 28 Z" fill="${shade(oc,-.12)}"/>`;
  f+=`<circle cx="-19.5" cy="54" r="3" fill="${SKIN}"/><circle cx="19.5" cy="54" r="3" fill="${SKIN}"/>`;
  f+=`<rect x="-3.5" y="7" width="7" height="6" fill="${shade(SKIN,-.08)}"/>`;
  f+=`<path d="M-17 16 Q-17 12 -9 11 L9 11 Q17 12 17 16 L14 56 L-14 56 Z" fill="${oc}"/>`;
  f+={blazer:`<path d="M-5 11 L0 25 L5 11 Z" fill="#F4F4F2"/><path d="M-9 11 L-1 31" stroke="#141720" stroke-width="1.1"/><path d="M9 11 L1 31" stroke="#141720" stroke-width="1.1"/>`,
      social:`<path d="M-5 11 L-1 16 L-3 10 Z M5 11 L1 16 L3 10 Z" fill="#E8F0F9"/><line x1="0" y1="15" x2="0" y2="55" stroke="#93AACB" stroke-width=".7"/>`,
      casual:`<path d="M-5 11 Q0 15 5 11" stroke="#AF9C79" fill="none" stroke-width="1.4"/>`,
      basica:`<path d="M-4.5 11 Q0 14 4.5 11" stroke="#33363D" fill="none" stroke-width="1"/>`,
      manter:`<path d="M-5 11 L0 17 L5 11 Z" fill="#E9EDF2"/>`}[s.pOutfit]||"";
  f+=`<ellipse cx="0" cy="-1.5" rx="11" ry="12" fill="${HAIR}"/><ellipse cx="0" cy="0" rx="9" ry="10.5" fill="${SKIN}"/>`;
  f+=`<path d="M-10 -1 Q-10.5 -13.5 0 -13.5 Q10.5 -13.5 10 -1 Q7 -8.5 0 -8.5 Q-7 -8.5 -10 -1 Z" fill="${HAIR}"/>`;
  f+=`<circle cx="-3.5" cy="-1" r=".95" fill="#2A211C"/><circle cx="3.5" cy="-1" r=".95" fill="#2A211C"/><path d="M-5 -3.6 L-2.2 -3.9 M2.2 -3.9 L5 -3.6" stroke="${HAIR}" stroke-width=".7"/>`;
  f+={sorriso:`<path d="M-3.5 4 Q0 7 3.5 4" stroke="#8C4A3C" stroke-width=".9" fill="none" stroke-linecap="round"/>`,
      confiante:`<path d="M-3 4.8 L3 4.8" stroke="#8C4A3C" stroke-width=".9" stroke-linecap="round"/>`}[s.pExpr]||`<path d="M-3 4.4 Q0 5.6 3 4.4" stroke="#8C4A3C" stroke-width=".9" fill="none" stroke-linecap="round"/>`;
  if(s.pLight==="golden")f+=`<path d="M-10.5 -2 Q-11 -13.5 0 -14.6 Q11 -13.5 10.5 -2" stroke="#FFE1A0" stroke-width="1.5" fill="none"/><path d="M-17 16 Q-17 12 -9 11" stroke="#FFE1A0" stroke-width="1.2" fill="none"/><path d="M17 16 Q17 12 9 11" stroke="#FFE1A0" stroke-width="1.2" fill="none"/>`;
  if(s.pLight==="dramatica")f+=`<path d="M0 -14 Q11 -14 11 0 Q11 11 0 11 Z M0 11 L9 11 Q17 12 17 16 L14 56 L0 56 Z M16 14 Q23 17 23 30 L22 52 L17 52 L16 28 Z" fill="#000" opacity=".42"/>`;
  let light="";
  if(s.pLight==="janela")light=`<rect width="${W}" height="${H}" fill="url(#${id}w)"/>`;
  if(s.pLight==="estudio")light=`<rect width="${W}" height="${H}" fill="#fff" opacity=".07"/>`;
  if(s.pLight==="golden")light=`<rect width="${W}" height="${H}" fill="#FFB25C" opacity=".16"/>`;
  if(s.pLight==="dramatica")light=`<rect width="${W}" height="${H}" fill="url(#${id}d)"/>`;
  const lc={fria:["#9DBBFF",.2],quente:["#FFAA4D",.2]}[s.pLightColor];
  if(lc)light+=`<rect width="${W}" height="${H}" fill="${lc[0]}" opacity="${lc[1]}"/>`;
  let icon="";
  if(!o.noIcon){
    const ic="#FFD45C";
    if(s.pLight==="janela")icon=`<rect x="2" y="${H*.3}" width="7" height="12" fill="${ic}" stroke="#7A5A00" stroke-width=".5"/><line x1="5.5" y1="${H*.3}" x2="5.5" y2="${H*.3+12}" stroke="#7A5A00" stroke-width=".5"/>`;
    if(s.pLight==="estudio")icon=`<polygon points="38,2 62,2 58,8 42,8" fill="${ic}" stroke="#7A5A00" stroke-width=".5"/>`;
    if(s.pLight==="golden")icon=`<circle cx="50" cy="3" r="4" fill="${ic}"/>`;
    if(s.pLight==="dramatica")icon=`<circle cx="6" cy="6" r="3.5" fill="${ic}"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Prévia">
    <defs><filter id="${id}b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>
    <linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <linearGradient id="${id}d" x1="0" y1="0" x2="1" y2="0"><stop offset=".3" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></linearGradient>
    <clipPath id="${id}c"><rect width="${W}" height="${H}"/></clipPath>${TS_FILTER(id)}</defs>
    <g clip-path="url(#${id}c)">${bg}<g transform="translate(${fx} ${fty}) scale(${fsc})">${f}</g>${light}${icon}${showText?textOverlay(s,W,H,zoneFor(s,W,H),{id,darkBg:s.pLight==="dramatica"||["estudio","cidade","externo"].includes(s.pBg)||(s.pBg==="cor"&&["preto","terracota"].includes(s.pBgColor)),brand:oc}):""}</g></svg>`;
}

/* ===== PRÉVIA DESENHADA (SVG) ===== */
const FMT_H={"45":125,"916":178,"11":100};
function shade(hex,amt){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(amt<0?v*(1+amt):v+(255-v)*amt)));return"#"+[f(r),f(g),f(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
let UID=0;
function drawScene(s,o={}){
  const kd=kindOf(s);
  if(kd==="carro")return drawCar(s,o);
  if(kd==="imovel")return drawHouse(s,o);
  const id="s"+(UID++), W=100, H=FMT_H[s.imgFormat]||125, thumb=!!o.thumb;
  const topView=s.imgAngle==="top"||s.imgStyle==="flatlay";
  const bgc=(BGCOLORS[s.bgColor]||BGCOLORS.bege).hex;
  const dark=s.imgLight==="dramatic";
  const showText=(!thumb||o.withText)&&!o.noText&&s.textMode!=="none", tpos=s.imgTextPos||"top";
  const zy0=showText&&tpos==="top"?H*.3:0, zy1=showText&&tpos==="bottom"?H*.7:H;
  const base=zy0+(zy1-zy0)*.8, horizon=base-(zy1-zy0)*.12;
  const blur=s.depth==="desfocado";
  let d=`<defs>
    <filter id="${id}b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>
    <filter id="${id}bs" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.4"/></filter>
    <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(bgc,.55)}"/><stop offset="1" stop-color="${shade(bgc,-.08)}"/></linearGradient>
    <linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <radialGradient id="${id}r" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
    <radialGradient id="${id}spot" cx=".35" cy=".35" r=".65"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".78"/></radialGradient>
    <clipPath id="${id}c"><rect width="${W}" height="${H}"/></clipPath>${TS_FILTER(id)}
  </defs><g clip-path="url(#${id}c)">`;
  // ---- fundo
  let bgFill="#F6F6F4";
  if(s.bg==="solid"||s.bg==="blur")bgFill=bgc;
  let bgG=`<rect width="${W}" height="${H}" fill="${bgFill}"/>`;
  if(s.bg==="gradient")bgG=`<rect width="${W}" height="${H}" fill="url(#${id}g)"/>`;
  if(s.bg==="blur")bgG+=[[22,.25],[70,.2],[45,.12],[85,.38],[12,.45]].map(([x,y],i)=>`<circle cx="${x}" cy="${H*y}" r="${7+i*2}" fill="#fff" opacity=".45" filter="url(#${id}b)"/>`).join("");
  if(s.bg==="scene"){
    const sc={wood:["#E6DACA","#C9B79F"],studio:["#1F2A44","#2E3B5C"],office:["#E3E6EA","#B9C0C9"],bath:["#F1F1EE","#D7DCE0"],kitchen:["#EFE8DC","#D9C9B0"],custom:["#E4E0D8","#C4BDB0"]}[s.cena]||["#E6DACA","#C9B79F"];
    bgG=`<rect width="${W}" height="${H}" fill="${sc[0]}"/><g filter="${blur?`url(#${id}b)`:"none"}">
      <rect x="8" y="${H*.08}" width="26" height="${H*.32}" fill="#fff" opacity=".7"/><line x1="21" y1="${H*.08}" x2="21" y2="${H*.4}" stroke="${sc[1]}" stroke-width="1.2"/><line x1="8" y1="${H*.24}" x2="34" y2="${H*.24}" stroke="${sc[1]}" stroke-width="1.2"/>
      <ellipse cx="80" cy="${horizon-14}" rx="9" ry="13" fill="${s.cena==="studio"?"#3B4A70":"#8FA486"}"/><rect x="77" y="${horizon-4}" width="6" height="6" fill="${sc[1]}"/>
      ${s.cena==="bath"?`<circle cx="58" cy="${H*.22}" r="12" fill="none" stroke="${sc[1]}" stroke-width="1.5"/>`:""}
      ${s.cena==="office"?`<rect x="52" y="${horizon-12}" width="20" height="12" rx="1" fill="#4A5260"/>`:""}
    </g>`;
  }
  // ---- superfície
  const surf={marmore:"#F0EFEC",madeira:"#B9875C",tecido:"#E8DDCC",pedra:"#9D9A96",espelho:shade(s.bg==="white"?"#D8DCE2":(s.bg==="scene"?"#C9CDD3":bgFill),-.12)}[s.surface];
  let surfG="";
  const texture=(y0,y1)=>{
    let t="";
    if(s.surface==="marmore")t=`<path d="M0 ${y0+(y1-y0)*.3} Q30 ${y0+(y1-y0)*.15} 55 ${y0+(y1-y0)*.45} T100 ${y0+(y1-y0)*.35}" stroke="#B9BBC0" stroke-width=".6" fill="none"/><path d="M10 ${y1} Q40 ${y0+(y1-y0)*.6} 90 ${y0+(y1-y0)*.75}" stroke="#C9CBCF" stroke-width=".5" fill="none"/>`;
    if(s.surface==="madeira")for(let i=1;i<6;i++)t+=`<path d="M0 ${y0+(y1-y0)*i/6} Q50 ${y0+(y1-y0)*i/6+1.5} 100 ${y0+(y1-y0)*i/6-1}" stroke="#97693F" stroke-width=".5" fill="none"/>`;
    if(s.surface==="tecido")for(let i=0;i<4;i++)t+=`<path d="M${i*28-6} ${y1} Q${i*28+8} ${y0+(y1-y0)*.3} ${i*28+22} ${y1}" stroke="#CFC1AB" stroke-width=".8" fill="none"/>`;
    if(s.surface==="pedra")for(let i=0;i<26;i++)t+=`<circle cx="${(i*37)%100}" cy="${y0+((i*53)%100)/100*(y1-y0)}" r=".7" fill="#7E7B77"/>`;
    return t;
  };
  if(!topView&&surf&&s.surface!=="infinito"&&s.surface!=="pedestal"){
    surfG=`<rect y="${horizon}" width="${W}" height="${H-horizon}" fill="${surf}"/>${texture(horizon,H)}`;
  } else if(!topView&&s.bg==="scene"&&(s.surface==="infinito"||s.surface==="pedestal")){
    surfG=`<rect y="${horizon}" width="${W}" height="${H-horizon}" fill="${shade("#E6DACA",-.1)}"/>`;
  }
  // ---- produto
  const PB="#3D4A66", PC="#C9A15B", PL="#F4F1EA";
  let pw=22, ph=34; const macro=s.imgAngle==="macro";
  if(macro){pw=44;ph=68}
  const cx=showText&&tpos==="left"?70:showText&&tpos==="right"?30:50; let by=base; if(s.surface==="pedestal"&&!topView)by=base-6;
  if(macro)by=Math.min(H+18,base+20);
  const prod=(x,y,w,h,threeq)=>{
    let g="";
    if(threeq)g+=`<polygon points="${x+w/2},${y-h} ${x+w/2+w*.32},${y-h-w*.18} ${x+w/2+w*.32},${y-w*.18} ${x+w/2},${y}" fill="${shade(PB,-.35)}"/><polygon points="${x-w/2},${y-h} ${x+w/2},${y-h} ${x+w/2+w*.32},${y-h-w*.18} ${x-w/2+w*.32},${y-h-w*.18}" fill="${shade(PB,.25)}"/>`;
    g+=`<rect x="${x-w/2}" y="${y-h}" width="${w}" height="${h}" rx="${w*.12}" fill="${PB}"/>`;
    g+=`<rect x="${x-w*.28}" y="${y-h-h*.14}" width="${w*.56}" height="${h*.16}" rx="${w*.06}" fill="${PC}"/>`;
    g+=`<rect x="${x-w*.36}" y="${y-h*.66}" width="${w*.72}" height="${h*.34}" rx="${w*.05}" fill="${PL}"/>`;
    g+=`<rect x="${x-w*.24}" y="${y-h*.58}" width="${w*.48}" height="${h*.05}" fill="${PB}" opacity=".7"/><rect x="${x-w*.18}" y="${y-h*.48}" width="${w*.36}" height="${h*.035}" fill="${PB}" opacity=".45"/>`;
    return g;
  };
  // sombra
  const shadowFor=(x,y,w)=>{
    if(s.shadow==="nenhuma")return `<ellipse cx="${x}" cy="${y}" rx="${w*.5}" ry="1.2" fill="#000" opacity=".08"/>`;
    const dir={window:1,studio:0,back:0,dramatic:1}[s.imgLight]??0;
    if(s.shadow==="marcada"){
      const len=s.imgLight==="back"?14:w*.9;
      if(s.imgLight==="back")return `<polygon points="${x-w/2},${y} ${x+w/2},${y} ${x+w*.7},${y+len} ${x-w*.7},${y+len}" fill="#000" opacity=".4"/>`;
      return `<polygon points="${x-w/2},${y} ${x+w/2},${y} ${x+w/2+len*dir+ (dir?0:w*.2)},${y-3} ${x-w/2+len*dir},${y-3}" fill="#000" opacity=".42"/>`;
    }
    return `<ellipse cx="${x+dir*w*.25}" cy="${y}" rx="${w*.65}" ry="${s.imgLight==="back"?4:2.6}" fill="#000" opacity=".32" filter="url(#${id}bs)"/>`;
  };
  let prodG="", extras="";
  if(topView){
    // vista de cima: tudo é superfície/fundo
    const tf=(s.surface&&s.surface!=="infinito"&&s.surface!=="pedestal")?surf:(s.bg==="white"?"#F6F6F4":bgc);
    bgG=`<rect width="${W}" height="${H}" fill="${s.bg==="gradient"&&(s.surface==="infinito"||s.surface==="pedestal")?`url(#${id}g)`:tf}"/>`+((s.surface!=="infinito"&&s.surface!=="pedestal")?texture(0,H):"");
    surfG="";
    const cy=(zy0+zy1)/2, sz=macro?52:28;
    const off=s.shadow==="nenhuma"?0:(s.shadow==="marcada"?3:2);
    prodG=`<rect x="${cx-sz/2+off}" y="${cy-sz/2+off}" width="${sz}" height="${sz}" rx="${sz*.14}" fill="#000" opacity="${s.shadow==="nenhuma"?.06:(s.shadow==="marcada"?.4:.25)}" ${s.shadow==="suave"?`filter="url(#${id}bs)"`:""}/>
      <rect x="${cx-sz/2}" y="${cy-sz/2}" width="${sz}" height="${sz}" rx="${sz*.14}" fill="${PB}"/><circle cx="${cx}" cy="${cy}" r="${sz*.22}" fill="${PC}"/><rect x="${cx-sz*.3}" y="${cy+sz*.26}" width="${sz*.6}" height="${sz*.1}" fill="${PL}"/>`;
    if(s.imgStyle==="flatlay"||s.imgStyle==="bundle"){
      extras+=`<ellipse cx="${cx-30}" cy="${cy-18}" rx="9" ry="4" fill="#7D9A6F" transform="rotate(-30 ${cx-30} ${cy-18})"/><ellipse cx="${cx+32}" cy="${cy+16}" rx="8" ry="3.5" fill="#7D9A6F" transform="rotate(40 ${cx+32} ${cy+16})"/>
        <circle cx="${cx+30}" cy="${cy-20}" r="6" fill="${PC}" opacity=".85"/><rect x="${cx-38}" y="${cy+10}" width="14" height="18" rx="2" fill="#fff" stroke="#ccc" stroke-width=".5"/>`;
    }
    if(s.imgStyle==="lifestyle")extras+=`<ellipse cx="${cx-sz*.55}" cy="${cy+sz*.55}" rx="7" ry="13" fill="#E1B08C" transform="rotate(35 ${cx-sz*.55} ${cy+sz*.55})"/><ellipse cx="${cx+sz*.55}" cy="${cy+sz*.55}" rx="7" ry="13" fill="#E1B08C" transform="rotate(-35 ${cx+sz*.55} ${cy+sz*.55})"/>`;
  } else {
    if(s.surface==="pedestal"){
      const pc=s.bg==="white"?"#ECECEA":shade(s.bg==="scene"?"#E6DACA":bgc,.25);
      prodG+=`<rect x="${cx-pw*.95}" y="${by}" width="${pw*1.9}" height="${H-by}" fill="${pc}"/><ellipse cx="${cx}" cy="${by}" rx="${pw*.95}" ry="3" fill="${shade(pc,.3)}"/>`;
    }
    if(s.surface==="espelho"&&!macro)prodG+=`<g transform="translate(0 ${2*by}) scale(1 -1)" opacity=".22">${prod(cx,by,pw,ph,s.imgAngle==="threeq")}</g>`;
    prodG+=shadowFor(cx,by,pw);
    if(s.imgStyle==="bundle"&&!macro){
      extras+=`<rect x="${cx-pw*1.55}" y="${by-ph*.62}" width="${pw*.62}" height="${ph*.62}" rx="2" fill="#2B2F38"/><rect x="${cx-pw*1.5}" y="${by-ph*.57}" width="${pw*.52}" height="${ph*.5}" fill="${PB}"/>
        <rect x="${cx+pw*.95}" y="${by-ph*.4}" width="${pw*.7}" height="${ph*.4}" rx="1.5" fill="${PL}" stroke="#bbb" stroke-width=".4"/>`;
    }
    prodG+=extras; extras="";
    prodG+=prod(cx,by,pw,ph,s.imgAngle==="threeq");
    if(s.imgLight==="back")prodG=`<ellipse cx="${cx}" cy="${by-ph/2}" rx="${pw*1.3}" ry="${ph*.8}" fill="url(#${id}r)"/>`+prodG+`<rect x="${cx-pw/2}" y="${by-ph}" width="${pw}" height="${ph}" rx="${pw*.12}" fill="none" stroke="#fff" stroke-width="1.1" opacity=".9"/>`;
    if(s.imgStyle==="lifestyle")prodG+=`<ellipse cx="${cx-pw*.55}" cy="${by-ph*.35}" rx="${pw*.28}" ry="${ph*.33}" fill="#E1B08C" transform="rotate(18 ${cx-pw*.55} ${by-ph*.35})"/><ellipse cx="${cx+pw*.55}" cy="${by-ph*.3}" rx="${pw*.28}" ry="${ph*.33}" fill="#D9A47E" transform="rotate(-18 ${cx+pw*.55} ${by-ph*.3})"/>`;
  }
  // ---- luz
  let light="";
  if(s.imgLight==="window")light=`<rect width="${W}" height="${H}" fill="url(#${id}w)"/>`;
  if(s.imgLight==="studio")light=`<rect width="${W}" height="${H}" fill="#fff" opacity=".08"/>`;
  if(dark)light=`<rect width="${W}" height="${H}" fill="url(#${id}spot)"/>`;
  const lc={fria:["#9DBBFF",.22],quente:["#FFAA4D",.22]}[s.lightColor];
  if(lc)light+=`<rect width="${W}" height="${H}" fill="${lc[0]}" opacity="${lc[1]}"/>`;
  // ícone da fonte de luz
  let icon="";
  if(!o.noIcon){
    const ic="#FFD45C";
    if(s.imgLight==="window")icon=`<g opacity=".95"><rect x="2" y="${H*.42}" width="7" height="12" fill="${ic}" stroke="#7A5A00" stroke-width=".5"/><line x1="5.5" y1="${H*.42}" x2="5.5" y2="${H*.42+12}" stroke="#7A5A00" stroke-width=".5"/></g>`;
    if(s.imgLight==="studio")icon=`<polygon points="38,2 62,2 58,8 42,8" fill="${ic}" stroke="#7A5A00" stroke-width=".5"/>`;
    if(s.imgLight==="dramatic")icon=`<circle cx="7" cy="7" r="3.5" fill="${ic}"/><polygon points="9,9 13,6 ${cx},${base-20} ${cx-10},${base-10}" fill="${ic}" opacity=".18"/>`;
  }
  // ---- zona de texto
  let txt="";
  if(showText){
    const darkBg=dark||(["solid","blur","gradient"].includes(s.bg)&&["preto","terracota"].includes(s.bgColor))||(s.bg==="scene"&&s.cena==="studio");
    txt=textOverlay(s,W,H,zoneFor(s,W,H),{id,darkBg,brand:PB});
  }
  const bgWrap=blur&&s.bg!=="scene"&&!topView?`<g filter="url(#${id}b)">${bgG}</g>`:bgG;
  d+=bgWrap+surfG+prodG+extras+light+icon+txt+`</g>`;
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Prévia">${d}</svg>`;
}

/* prévia do carro */
function txtArea(s,o,H){
  const showText=(!o.thumb||o.withText)&&!o.noText&&s.textMode!=="none", tpos=s.imgTextPos||"top";
  return {showText,tpos,zy0:showText&&tpos==="top"?H*.3:0,zy1:showText&&tpos==="bottom"?H*.7:H,
    cx:showText&&tpos==="left"?70:showText&&tpos==="right"?30:50, side:showText&&(tpos==="left"||tpos==="right")};
}
const CAR_C="#B5322B";
function carSide(c){ // perfil, chão em y=0, frente à direita, 0..70 de largura
  return `<path d="M1 -4 L1 -9 Q2 -11.5 8 -12 L20 -12.5 L27 -18 Q29 -19.5 33 -19.5 L47 -19.5 Q51 -19.5 54 -17 L60 -12.5 L67 -11.5 Q70 -10.5 70 -8 L70 -4 Z" fill="${c}"/>
  <path d="M23.5 -12.5 L28.8 -17.6 L39 -17.6 L39 -12.5 Z M41 -12.5 L41 -17.6 L49.5 -17.6 Q51.5 -17.6 53.5 -15.6 L56.5 -12.5 Z" fill="#26303D"/>
  <line x1="40" y1="-12.5" x2="40" y2="-4.5" stroke="${shade(c,-.35)}" stroke-width=".5"/><line x1="2" y1="-8.5" x2="69" y2="-8.5" stroke="${shade(c,.3)}" stroke-width=".4" opacity=".7"/>
  <rect x="66.5" y="-10.2" width="3" height="1.8" rx=".5" fill="#FFF3C4"/><rect x="1.2" y="-10" width="2" height="2" rx=".4" fill="#E0312B"/>
  ${[15,56].map(x=>`<circle cx="${x}" cy="-5" r="6.3" fill="${shade(c,-.55)}"/><circle cx="${x}" cy="-5" r="5.2" fill="#15171B"/><circle cx="${x}" cy="-5" r="2.9" fill="#A9AFB7"/><circle cx="${x}" cy="-5" r=".9" fill="#5B6068"/>`).join("")}`;
}
function carFront34(c){
  return carSide(c)+`<path d="M70 -12 L76 -10.3 L76 -3.2 L70 -4 Z" fill="${shade(c,-.28)}"/><path d="M60 -12.5 L66 -11.6 L73 -10.6 L69 -12.3 Z" fill="${shade(c,.15)}"/>
  <rect x="71.5" y="-9.4" width="3.6" height="1.6" rx=".4" fill="#FFF3C4"/><rect x="71.6" y="-7" width="3.4" height="2" fill="#1C1F25"/>`;
}
function carFront(c){ // de frente, centrado em 0, chão em y=0
  return `<rect x="-19" y="-4.5" width="6" height="4.5" rx="1" fill="#15171B"/><rect x="13" y="-4.5" width="6" height="4.5" rx="1" fill="#15171B"/>
  <path d="M-21 -3.5 L-21 -11 Q-21 -13.5 -17 -14 L17 -14 Q21 -13.5 21 -11 L21 -3.5 Z" fill="${c}"/>
  <path d="M-15 -14 L-11 -21.5 L11 -21.5 L15 -14 Z" fill="${shade(c,-.1)}"/><path d="M-13 -14.6 L-10 -20.6 L10 -20.6 L13 -14.6 Z" fill="#26303D"/>
  <rect x="-19" y="-11.5" width="7" height="2.4" rx=".7" fill="#FFF3C4"/><rect x="12" y="-11.5" width="7" height="2.4" rx=".7" fill="#FFF3C4"/>
  <rect x="-8" y="-10" width="16" height="4.2" rx="1" fill="#1C1F25"/><circle cx="0" cy="-7.9" r="1.1" fill="#C9CED6"/>
  <rect x="-23.5" y="-14.5" width="3" height="2" rx=".6" fill="${shade(c,-.2)}"/><rect x="20.5" y="-14.5" width="3" height="2" rx=".6" fill="${shade(c,-.2)}"/>`;
}
function drawCar(s,o={}){
  const id="c"+(UID++), W=100, H=FMT_H[s.imgFormat]||125, T=txtArea(s,o,H);
  const {zy0,zy1}=T, span=zy1-zy0, horizon=zy0+span*.58, gy=zy0+span*.84;
  const motion=s.imgStyle==="movimento", blur=s.depth==="desfocado"||motion;
  const bl=blur?`filter="url(#${id}b)"`:"", bgc=(BGCOLORS[s.bgColor]||BGCOLORS.cinza).hex;
  let bg="", floor="";
  switch(s.bg){
    case "showroom":bg=`<rect width="${W}" height="${H}" fill="#E4E7EA"/><g ${bl}>${[0,1,2,3,4].map(i=>`<rect x="${1+i*20}" y="${horizon-span*.42}" width="18" height="${span*.42}" fill="#F7FAFD" stroke="#BCC3CB" stroke-width=".7"/>`).join("")}<rect x="0" y="${horizon-span*.46}" width="100" height="${span*.04}" fill="#C3C9D0"/><ellipse cx="18" cy="${horizon-span*.12}" rx="5" ry="${span*.1}" fill="#9DB596"/></g>`;break;
    case "estudio":bg=`<rect width="${W}" height="${H}" fill="#15171C"/><rect x="14" y="${Math.max(1,zy0+span*.06)}" width="72" height="5" rx="1.5" fill="#F4F6F8" opacity=".92" ${bl}/><ellipse cx="50" cy="${horizon}" rx="46" ry="${span*.16}" fill="#2A2E36" ${bl}/>`;break;
    case "estudioclaro":bg=`<rect width="${W}" height="${H}" fill="#F5F5F3"/>`;break;
    case "solid":bg=`<rect width="${W}" height="${H}" fill="${bgc}"/><ellipse cx="50" cy="${horizon}" rx="44" ry="${span*.14}" fill="${shade(bgc,.2)}" ${`filter="url(#${id}b)"`}/>`;break;
    case "urbano":bg=`<rect width="${W}" height="${H}" fill="#18203A"/><g ${bl}>${[[0,22,"#252E4A"],[18,34,"#2D3756"],[40,26,"#222B45"],[62,38,"#2A3352"],[82,28,"#243050"]].map(([x,h,c])=>`<rect x="${x}" y="${horizon-span*h/100*1.4}" width="20" height="${span*h/100*1.4}" fill="${c}"/>`).join("")}${[[8,.3,"#F5C26B"],[26,.2,"#9DB7E0"],[47,.35,"#E88F6A"],[70,.25,"#F5C26B"],[90,.32,"#9DB7E0"],[58,.15,"#F2E2B8"]].map(([x,y,c],i)=>`<circle cx="${x}" cy="${zy0+span*y}" r="${2.5+i%3}" fill="${c}" opacity=".9"/>`).join("")}</g>`;break;
    case "estrada":bg=`<rect width="${W}" height="${H}" fill="url(#${id}sky)"/><g ${bl}><path d="M0 ${horizon} Q20 ${horizon-span*.16} 42 ${horizon-span*.05} T100 ${horizon-span*.1} L100 ${horizon+1} L0 ${horizon+1} Z" fill="#7C9C68"/><path d="M0 ${horizon} Q35 ${horizon-span*.08} 60 ${horizon} L0 ${horizon+1} Z" fill="#5E8051"/></g>`;break;
    case "garagem":bg=`<rect width="${W}" height="${H}" fill="#D9DDE1"/><g ${bl}><rect x="0" y="${horizon-span*.5}" width="100" height="${span*.5}" fill="#EDE8E0"/><rect x="0" y="${horizon-span*.54}" width="100" height="${span*.05}" fill="#6F6A64"/><rect x="18" y="${horizon-span*.38}" width="64" height="${span*.38}" fill="#3B3F46"/>${[1,2,3,4,5].map(i=>`<line x1="18" y1="${horizon-span*.38+i*span*.065}" x2="82" y2="${horizon-span*.38+i*span*.065}" stroke="#555A62" stroke-width=".6"/>`).join("")}<rect x="86" y="${horizon-span*.3}" width="9" height="${span*.3}" fill="#8A5A3C"/></g>`;break;
    default:bg=`<rect width="${W}" height="${H}" fill="#E4E7EA"/>`;
  }
  const fl={asfalto:"#3A3D42",molhado:"#262A32",concreto:"#C7CBCF",terra:"#A87A52",
    estudio:s.bg==="estudio"?"#202329":s.bg==="solid"?shade(bgc,-.1):s.bg==="estudioclaro"?"#E9E9E6":"#C7CBCF"}[s.surface]||"#3A3D42";
  floor=`<rect y="${horizon}" width="${W}" height="${H-horizon}" fill="${fl}"/>`;
  if(s.surface==="asfalto"||s.surface==="molhado"){if(s.bg==="estrada"||s.bg==="urbano")floor+=`<rect x="0" y="${gy+span*.07}" width="100" height="1" fill="#E8E2C8" opacity=".7" stroke-dasharray="6 5"/>`;}
  if(s.surface==="terra")floor+=`<path d="M0 ${gy+3} Q50 ${gy+1} 100 ${gy+4}" stroke="#8C6440" stroke-width="1.2" fill="none"/><path d="M0 ${gy+8} Q50 ${gy+6} 100 ${gy+9}" stroke="#8C6440" stroke-width="1.2" fill="none"/>`;
  if(s.surface==="molhado")floor+=[[14,"#F5C26B"],[48,"#9DB7E0"],[82,"#E88F6A"]].map(([x,c])=>`<rect x="${x-1.2}" y="${horizon+1}" width="2.4" height="${H-horizon}" fill="${c}" opacity=".18"/>`).join("");
  // carro
  const sc=(T.side?.72:1)*Math.min(1.25,span/55);
  let car="", carW=0, view=s.imgAngle;
  const reflect=["molhado","concreto","estudio"].includes(s.surface);
  const shadowE=(w)=>s.shadow==="nenhuma"?`<ellipse cx="${T.cx}" cy="${gy}" rx="${w*.46}" ry="1" fill="#000" opacity=".25"/>`:
    s.shadow==="marcada"?`<polygon points="${T.cx-w*.48},${gy} ${T.cx+w*.48},${gy} ${T.cx+w*.62},${gy+3.5} ${T.cx-w*.34},${gy+3.5}" fill="#000" opacity=".45"/>`:
    `<ellipse cx="${T.cx}" cy="${gy+.5}" rx="${w*.56}" ry="2.6" fill="#000" opacity=".45" filter="url(#${id}bs)"/>`;
  if(s.imgStyle==="interior"){
    const dash=zy0+span*.6;
    car=`<polygon points="0,${zy0} 12,${zy0} 22,${dash} 0,${dash}" fill="#1D2026"/><polygon points="100,${zy0} 88,${zy0} 78,${dash} 100,${dash}" fill="#1D2026"/><rect x="0" y="${zy0}" width="100" height="${span*.06}" fill="#24272E"/>
      <path d="M0 ${dash} Q50 ${dash-span*.06} 100 ${dash} L100 ${H} L0 ${H} Z" fill="#2B2E35"/><rect x="47" y="${dash-span*.02}" width="20" height="${span*.11}" rx="1.5" fill="#3B6EA8"/>
      <circle cx="31" cy="${dash+span*.14}" r="${span*.14}" fill="none" stroke="#111317" stroke-width="3.2"/><circle cx="31" cy="${dash+span*.14}" r="3" fill="#111317"/>
      <path d="M2 ${H} L6 ${dash+span*.26} Q14 ${dash+span*.2} 22 ${dash+span*.26} L24 ${H} Z M76 ${H} L78 ${dash+span*.26} Q86 ${dash+span*.2} 94 ${dash+span*.26} L98 ${H} Z" fill="#3A3330"/>`;
    floor="";
  } else if(s.imgStyle==="detalhe"){
    const r=span*.26, wy=zy0+span*.62;
    car=`<path d="M0 ${zy0} L100 ${zy0} L100 ${wy-r*1.25} Q${T.cx} ${wy-r*1.7} 0 ${wy-r*1.25} Z" fill="${CAR_C}"/><path d="M${T.cx-r*1.35} ${wy+r*.3} A${r*1.35} ${r*1.35} 0 0 1 ${T.cx+r*1.35} ${wy+r*.3}" fill="${shade(CAR_C,-.5)}"/>
      <circle cx="${T.cx}" cy="${wy}" r="${r}" fill="#15171B"/><circle cx="${T.cx}" cy="${wy}" r="${r*.64}" fill="#B3B9C1"/>${[0,72,144,216,288].map(a=>`<line x1="${T.cx}" y1="${wy}" x2="${T.cx+Math.cos(a*Math.PI/180)*r*.62}" y2="${wy+Math.sin(a*Math.PI/180)*r*.62}" stroke="#6D737C" stroke-width="${r*.12}"/>`).join("")}<circle cx="${T.cx}" cy="${wy}" r="${r*.15}" fill="#3F444B"/>
      <rect x="${T.cx+r*.9}" y="${wy-r*1.55}" width="${r*.9}" height="${r*.3}" rx="${r*.1}" fill="#FFF3C4"/>`;
  } else if(view==="frente"){
    carW=46*sc;
    const g=`<g transform="translate(${T.cx} ${gy}) scale(${sc})">${carFront(CAR_C)}</g>`;
    car=(reflect?`<g transform="translate(0 ${2*gy}) scale(1 -1)" opacity=".22">${g}</g>`:"")+shadowE(carW)+g;
  } else {
    const big=view==="baixo"?1.18:1, s2=sc*big;
    const w=(view==="lateral"?70:76)*s2; carW=w;
    const body=view==="lateral"?carSide(CAR_C):carFront34(CAR_C);
    const flip=view==="traseira34";
    const tr=flip?`translate(${T.cx+w/2} ${gy}) scale(${-s2} ${s2})`:`translate(${T.cx-w/2} ${gy}) scale(${s2})`;
    let extra="";
    if(flip)extra=`<rect x="70.6" y="-9.6" width="4.6" height="1.8" rx=".4" fill="#E0312B"/>`;
    const g=`<g transform="${tr}">${body}${extra}</g>`;
    car=(reflect?`<g transform="translate(0 ${2*gy}) scale(1 -1)" opacity=".22">${g}</g>`:"")+shadowE(w)+g;
    if(motion)car=[0,1,2,3].map(i=>`<rect x="${T.cx-w/2-28+i*3}" y="${gy-(4+i*4)*s2}" width="${22-i*3}" height=".7" fill="#fff" opacity=".55"/>`).join("")+car;
  }
  // luz
  let light="";
  if(s.imgLight==="studio")light=`<rect width="${W}" height="${H}" fill="#fff" opacity=".06"/>`;
  if(s.imgLight==="golden")light=`<rect width="${W}" height="${H}" fill="url(#${id}gold)"/>`;
  if(s.imgLight==="noite")light=`<rect width="${W}" height="${H}" fill="#0B1430" opacity=".38"/>`+(s.imgStyle==="estatico"||s.imgStyle==="movimento"?(view==="frente"?[-15.5,15.5]:view==="traseira34"?[]:[0]).map(dx=>`<ellipse cx="${view==="frente"?T.cx+dx*sc:T.cx+carW*.48}" cy="${gy-10*sc}" rx="${6*sc}" ry="${3*sc}" fill="#FFF3C4" opacity=".55" filter="url(#${id}bs)"/>`).join(""):"");
  if(s.imgLight==="nublado")light=`<rect width="${W}" height="${H}" fill="#B8BEC6" opacity=".14"/>`;
  const lc={fria:["#9DBBFF",.2],quente:["#FFAA4D",.2]}[s.lightColor];
  if(lc)light+=`<rect width="${W}" height="${H}" fill="${lc[0]}" opacity="${lc[1]}"/>`;
  let icon="";
  if(!o.noIcon){
    const ic="#FFD45C";
    if(s.imgLight==="sol")icon=`<circle cx="88" cy="${zy0+8}" r="4.5" fill="${ic}"/>`;
    if(s.imgLight==="golden")icon=`<circle cx="10" cy="${horizon-3}" r="4.5" fill="#FF9F43"/>`;
    if(s.imgLight==="studio")icon=`<rect x="30" y="${zy0+2}" width="40" height="3.5" rx="1" fill="${ic}" stroke="#7A5A00" stroke-width=".5"/>`;
    if(s.imgLight==="noite")icon=`<path d="M88 ${zy0+4} a4.5 4.5 0 1 0 4 7 a3.6 3.6 0 1 1 -4 -7 Z" fill="${ic}"/>`;
    if(s.imgLight==="nublado")icon=`<g fill="#EEF1F4"><circle cx="84" cy="${zy0+9}" r="3.5"/><circle cx="89" cy="${zy0+7.5}" r="4.5"/><circle cx="94" cy="${zy0+9.5}" r="3"/></g>`;
  }
  const dark=["estudio","urbano"].includes(s.bg)||s.imgLight==="noite"||s.imgStyle==="interior"||(s.bg==="solid"&&["preto","terracota"].includes(s.bgColor));
  const txt=T.showText?textOverlay(s,W,H,zoneFor(s,W,H),{id,darkBg:dark,brand:CAR_C}):"";
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Prévia">
    <defs><filter id="${id}b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.6"/></filter>
    <filter id="${id}bs" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.8"/></filter>
    <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB6E8"/><stop offset="1" stop-color="#D7EAF7"/></linearGradient>
    <linearGradient id="${id}gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF9F43" stop-opacity=".45"/><stop offset="1" stop-color="#FF9F43" stop-opacity=".08"/></linearGradient>
    <clipPath id="${id}c"><rect width="${W}" height="${H}"/></clipPath>${TS_FILTER(id)}</defs>
    <g clip-path="url(#${id}c)">${bg}${floor}${car}${light}${icon}${txt}</g></svg>`;
}

/* prévia da casa / imóvel */
const SKY={dia:["#6FAEE6","#CFE6F7"],golden:["#F09A55","#F8DDB0"],noite:["#18234A","#4A5B8E"],nublado:["#B4BEC8","#E0E5EA"]};
function drawHouse(s,o={}){
  const id="h"+(UID++), W=100, H=FMT_H[s.imgFormat]||125, T=txtArea(s,o,H);
  const {zy0,zy1}=T, span=zy1-zy0, sky=SKY[s.bg]||SKY.dia;
  const ext=s.imgStyle==="fachada"||s.imgStyle==="gourmet";
  const lit=s.imgLight==="acesas"||s.bg==="noite", winC=lit?"#FFD27A":shade(sky[0],.35);
  const deco=s.surface, sc=T.side?.62:1;
  let g="";
  const skyG=`<rect width="${W}" height="${H}" fill="url(#${id}sky)"/>`;
  const plants=(x,y,n,big)=>Array.from({length:n},(_,i)=>`<circle cx="${x+i*5}" cy="${y}" r="${big?3.4:2.4}" fill="${i%2?"#5E8A4E":"#6F9C5C"}"/>`).join("");
  const palm=(x,y,h)=>`<path d="M${x} ${y} Q${x+1} ${y-h*.5} ${x} ${y-h}" stroke="#7A5B3E" stroke-width="1.2" fill="none"/>${[-60,-20,20,60,180].map(a=>`<ellipse cx="${x+Math.cos((a-90)*Math.PI/180)*4}" cy="${y-h+Math.sin((a-90)*Math.PI/180)*2.4}" rx="4.5" ry="1.3" fill="#4E7F44" transform="rotate(${a/2} ${x} ${y-h})"/>`).join("")}`;
  if(ext&&s.imgAngle==="drone"){
    const y0=zy0+span*.1, y1=zy0+span*.85, cx=T.cx;
    g=`<rect width="${W}" height="${H}" fill="#8DB474"/><rect x="0" y="${y1}" width="100" height="${H-y1}" fill="#5A5E64"/><rect x="0" y="${y1-2}" width="100" height="2" fill="#C9C9C4"/>
      <rect x="${cx-34*sc}" y="${y0}" width="${68*sc}" height="${y1-y0-3}" fill="#9CC584" stroke="#E8E4DA" stroke-width="1"/>
      <polygon points="${cx-26*sc},${y0+span*.28} ${cx-4*sc},${y0+span*.12} ${cx+18*sc},${y0+span*.28} ${cx+18*sc},${y0+span*.5} ${cx-26*sc},${y0+span*.5}" fill="#8C8F95"/><polygon points="${cx-26*sc},${y0+span*.28} ${cx-4*sc},${y0+span*.12} ${cx-4*sc},${y0+span*.5} ${cx-26*sc},${y0+span*.5}" fill="#A3A6AB"/>
      <rect x="${cx+4*sc}" y="${y0+span*.55}" width="${18*sc}" height="${span*.12}" rx="1.5" fill="#4FB3E0" stroke="#EDE7DA" stroke-width="1"/><rect x="${cx-24*sc}" y="${y0+span*.52}" width="${10*sc}" height="${y1-y0-span*.52-3}" fill="#BDB8AE"/>
      ${deco==="decorar"?plants(cx-30*sc,y0+span*.08,4,true)+plants(cx+10*sc,y0+span*.06,4,true):""}`;
  } else if(ext&&s.imgAngle==="detalhe"){
    g=`<rect width="${W}" height="${H}" fill="#E9E3D8"/>${Array.from({length:9},(_,i)=>`<rect x="0" y="${zy0+i*span/9}" width="38" height="${span/9-1}" fill="${i%2?"#9A6B47":"#A9784F"}"/>`).join("")}
      <rect x="${T.cx-12}" y="${zy0+span*.18}" width="26" height="${span*.82}" fill="#6B4630"/><rect x="${T.cx+9}" y="${zy0+span*.52}" width="2" height="${span*.14}" rx="1" fill="#D8C9A0"/>
      <rect x="${T.cx+20}" y="${zy0+span*.3}" width="5" height="${span*.1}" rx="1" fill="#2E3238"/>${lit?`<ellipse cx="${T.cx+22.5}" cy="${zy0+span*.44}" rx="8" ry="${span*.08}" fill="#FFD27A" opacity=".55" filter="url(#${id}bs)"/>`:""}`;
  } else if(ext){
    const gy=zy0+span*.8, cx=T.cx, w=74*sc, hh=span*.46, x0=cx-w/2, diag=s.imgAngle==="diagonal";
    g=skyG+`<rect x="0" y="${gy}" width="100" height="${H-gy}" fill="${deco==="vazio"?"#93A97F":"#7FA86A"}"/><rect x="0" y="${gy+span*.08}" width="100" height="${span*.05}" fill="#C9C7C0"/><rect x="0" y="${gy+span*.13}" width="100" height="${H}" fill="#5A5E64"/>`;
    if(s.imgStyle==="gourmet"){
      g+=`<rect x="${x0}" y="${gy-hh*.08}" width="${w}" height="${hh*.08}" fill="#B9A58C"/><rect x="${x0+w*.06}" y="${gy-hh*.9}" width="2" height="${hh*.82}" fill="#7A5B3E"/><rect x="${x0+w*.6}" y="${gy-hh*.9}" width="2" height="${hh*.82}" fill="#7A5B3E"/>
        <rect x="${x0+w*.02}" y="${gy-hh*.96}" width="${w*.66}" height="${hh*.08}" fill="#8C6A4A"/><rect x="${x0+w*.14}" y="${gy-hh*.55}" width="${w*.18}" height="${hh*.47}" fill="#D8D2C6"/><rect x="${x0+w*.18}" y="${gy-hh*.42}" width="${w*.1}" height="${hh*.14}" fill="#2B2E35"/>
        <rect x="${x0+w*.38}" y="${gy-hh*.32}" width="${w*.16}" height="${hh*.06}" fill="#8C6A4A"/><ellipse cx="${x0+w*.86}" cy="${gy+span*.04}" rx="${w*.17}" ry="${span*.035}" fill="#4FB3E0"/>${deco!=="vazio"?palm(x0+w*.98,gy,hh*.9):""}${lit?`<circle cx="${x0+w*.34}" cy="${gy-hh*.86}" r="1.4" fill="#FFE29A"/><circle cx="${x0+w*.5}" cy="${gy-hh*.86}" r="1.4" fill="#FFE29A"/>`:""}`;
    } else {
      if(diag)g+=`<polygon points="${x0+w},${gy-hh} ${x0+w+w*.16},${gy-hh*.86} ${x0+w+w*.16},${gy-hh*.02} ${x0+w},${gy}" fill="#CFC8BC"/><polygon points="${x0+w},${gy-hh*1.08} ${x0+w+w*.18},${gy-hh*.94} ${x0+w+w*.18},${gy-hh*.86} ${x0+w},${gy-hh}" fill="#5D6168"/>`;
      g+=`<rect x="${x0}" y="${gy-hh}" width="${w*.62}" height="${hh}" fill="#F1ECE3"/><rect x="${x0+w*.62}" y="${gy-hh*.7}" width="${w*.38}" height="${hh*.7}" fill="#E4DDD1"/>
        <rect x="${x0-w*.03}" y="${gy-hh*1.08}" width="${w*.68}" height="${hh*.08}" fill="#5D6168"/><rect x="${x0+w*.6}" y="${gy-hh*.78}" width="${w*.43}" height="${hh*.08}" fill="#5D6168"/>
        ${Array.from({length:7},(_,i)=>`<rect x="${x0+w*.02}" y="${gy-hh*.92+i*hh*.12}" width="${w*.16}" height="${hh*.1}" fill="${i%2?"#9A6B47":"#A9784F"}"/>`).join("")}
        <rect x="${x0+w*.24}" y="${gy-hh*.82}" width="${w*.32}" height="${hh*.34}" fill="${winC}" stroke="#3E4148" stroke-width=".8"/><line x1="${x0+w*.4}" y1="${gy-hh*.82}" x2="${x0+w*.4}" y2="${gy-hh*.48}" stroke="#3E4148" stroke-width=".6"/>
        <rect x="${x0+w*.26}" y="${gy-hh*.4}" width="${w*.12}" height="${hh*.4}" fill="#6B4630"/><rect x="${x0+w*.44}" y="${gy-hh*.36}" width="${w*.12}" height="${hh*.2}" fill="${winC}" stroke="#3E4148" stroke-width=".6"/>
        <rect x="${x0+w*.66}" y="${gy-hh*.56}" width="${w*.3}" height="${hh*.56}" fill="#4A4E55"/>${[1,2,3,4].map(i=>`<line x1="${x0+w*.66}" y1="${gy-hh*.56+i*hh*.11}" x2="${x0+w*.96}" y2="${gy-hh*.56+i*hh*.11}" stroke="#5E636B" stroke-width=".5"/>`).join("")}`;
      if(deco==="decorar")g+=palm(x0-w*.06,gy,hh*1.1)+plants(x0+w*.02,gy-1,4,false)+plants(x0+w*.44,gy-1,2,false);
      else if(deco==="manter")g+=plants(x0+w*.04,gy-1,3,false)+`<rect x="${x0+w*.7}" y="${gy+span*.02}" width="3" height="2" fill="#4F8BC9"/><circle cx="${x0+w*.5}" cy="${gy+span*.04}" r="1" fill="#8A8A8A"/>`;
      else if(deco==="arrumar")g+=plants(x0+w*.04,gy-1,3,false);
      if(lit)g+=`<ellipse cx="${x0+w*.4}" cy="${gy-hh*.65}" rx="${w*.22}" ry="${hh*.2}" fill="#FFD27A" opacity=".35" filter="url(#${id}bs)"/>`;
    }
  } else {
    // ambiente interno
    const wall=s.imgStyle==="banheiro"?"#E7EBEE":"#EFEAE2", floorC=s.imgStyle==="banheiro"?"#C9CFD4":"#C4A47F", top=zy0, bot=zy1;
    const diag=s.imgAngle==="diagonal";
    const bx0=diag?50:24, bx1=diag?50:76, by0=top+span*.16, by1=top+span*.64;
    if(s.imgAngle==="detalhe"){
      g=`<rect width="${W}" height="${H}" fill="${wall}"/><rect x="0" y="${top+span*.55}" width="100" height="${span*.1}" fill="#F2F1EE"/>${[[10,.57,60,.62],[30,.6,95,.56]].map(([a,b,c,d])=>`<path d="M${a} ${top+span*b} L${c} ${top+span*d}" stroke="#B9BBC0" stroke-width=".5"/>`).join("")}<rect x="0" y="${top+span*.65}" width="100" height="${H}" fill="#6B4E36"/>
        <path d="M${T.cx} ${top+span*.55} L${T.cx} ${top+span*.32} Q${T.cx} ${top+span*.26} ${T.cx+8} ${top+span*.26} L${T.cx+12} ${top+span*.26}" stroke="#AEB4BB" stroke-width="2.2" fill="none"/><rect x="${T.cx-14}" y="${top+span*.48}" width="10" height="${span*.07}" rx="1" fill="#7E9A72"/>`;
    } else {
      if(diag){
        g=`<rect width="${W}" height="${H}" fill="#E6E1D8"/><polygon points="0,${top} 50,${by0} 50,${by1} 0,${bot}" fill="${shade(wall,-.04)}"/><polygon points="100,${top} 50,${by0} 50,${by1} 100,${bot}" fill="${wall}"/>
          <polygon points="0,${bot} 50,${by1} 100,${bot}" fill="${floorC}"/><polygon points="0,${top} 50,${by0} 100,${top}" fill="#F7F5F1"/>
          <polygon points="62,${by0+span*.07} 84,${by0-span*.01} 84,${by1-span*.18} 62,${by1-span*.13}" fill="url(#${id}sky)" stroke="#FFFFFF" stroke-width="1"/>`;
      } else {
        g=`<rect width="${W}" height="${H}" fill="${wall}"/><polygon points="0,${top} ${bx0},${by0} ${bx0},${by1} 0,${bot}" fill="${shade(wall,-.06)}"/><polygon points="100,${top} ${bx1},${by0} ${bx1},${by1} 100,${bot}" fill="${shade(wall,-.06)}"/>
          <polygon points="0,${bot} ${bx0},${by1} ${bx1},${by1} 100,${bot}" fill="${floorC}"/><polygon points="0,${top} ${bx0},${by0} ${bx1},${by0} 100,${top}" fill="#F7F5F1"/>
          <rect x="${bx0+12}" y="${by0+span*.07}" width="${bx1-bx0-24}" height="${span*.22}" fill="url(#${id}sky)" stroke="#FFFFFF" stroke-width="1"/><line x1="50" y1="${by0+span*.07}" x2="50" y2="${by0+span*.29}" stroke="#fff" stroke-width=".8"/>`;
      }
      if(s.imgStyle!=="banheiro")g+=s.imgStyle==="cozinha"?"":`<line x1="0" y1="${bot}" x2="${diag?50:bx0}" y2="${by1}" stroke="${shade(floorC,-.2)}" stroke-width=".5"/>`;
      const fy=by1, cx=50;
      if(deco!=="vazio"){
        let fur="";
        if(s.imgStyle==="sala")fur=`<rect x="${cx-22}" y="${fy-span*.1}" width="44" height="${span*.1}" rx="2" fill="#8E9AA6"/><rect x="${cx-22}" y="${fy-span*.15}" width="44" height="${span*.06}" rx="2" fill="#7C8894"/><rect x="${cx-10}" y="${fy+span*.06}" width="20" height="${span*.04}" rx="1" fill="#6B4E36"/>`+(deco==="decorar"?`<ellipse cx="${cx}" cy="${fy+span*.1}" rx="30" ry="${span*.06}" fill="#D8CBB5" opacity=".9"/><rect x="${cx-10}" y="${fy+span*.06}" width="20" height="${span*.04}" rx="1" fill="#6B4E36"/><rect x="${cx-18}" y="${fy-span*.13}" width="7" height="${span*.05}" rx="1.5" fill="#D9A47E"/><rect x="${cx+11}" y="${fy-span*.13}" width="7" height="${span*.05}" rx="1.5" fill="#C3D0BC"/><rect x="${cx+28}" y="${fy-span*.2}" width="1.2" height="${span*.2}" fill="#3A3D42"/><ellipse cx="${cx+28.6}" cy="${fy-span*.21}" rx="3.5" ry="${span*.03}" fill="#F2E2B8"/><ellipse cx="${cx-30}" cy="${fy-span*.08}" rx="4" ry="${span*.09}" fill="#5E8A4E"/>`:"");
        if(s.imgStyle==="cozinha")fur=`<rect x="${diag?52:bx0}" y="${fy-span*.14}" width="${diag?40:bx1-bx0}" height="${span*.14}" fill="#F4F2EE" stroke="#C9C4BA" stroke-width=".5"/><rect x="${diag?52:bx0}" y="${fy-span*.15}" width="${diag?40:bx1-bx0}" height="${span*.02}" fill="#3A3D42"/><rect x="${diag?52:bx0}" y="${by0+span*.02}" width="${diag?40:bx1-bx0}" height="${span*.06}" fill="#F4F2EE" stroke="#C9C4BA" stroke-width=".5"/>`+(deco==="decorar"?`<rect x="${cx-16}" y="${fy+span*.04}" width="32" height="${span*.1}" fill="#6B4E36"/><rect x="${cx-17}" y="${fy+span*.03}" width="34" height="${span*.02}" fill="#F2F1EE"/><ellipse cx="${cx+8}" cy="${fy-span*.17}" rx="2.4" ry="${span*.025}" fill="#7E9A72"/>`:"");
        if(s.imgStyle==="quarto")fur=`<rect x="${cx-18}" y="${fy-span*.16}" width="36" height="${span*.1}" rx="1" fill="#7A6250"/><rect x="${cx-20}" y="${fy-span*.07}" width="40" height="${span*.15}" rx="2" fill="#F4F1EA"/><rect x="${cx-15}" y="${fy-span*.09}" width="12" height="${span*.04}" rx="1.5" fill="#E3DCCD"/><rect x="${cx+3}" y="${fy-span*.09}" width="12" height="${span*.04}" rx="1.5" fill="#E3DCCD"/>`+(deco==="decorar"?`<rect x="${cx-20}" y="${fy+span*.02}" width="40" height="${span*.05}" fill="#C3D0BC"/><rect x="${cx-27}" y="${fy-span*.07}" width="6" height="${span*.07}" fill="#6B4E36"/><ellipse cx="${cx-24}" cy="${fy-span*.09}" rx="2.4" ry="${span*.025}" fill="#F2E2B8"/>`:"");
        if(s.imgStyle==="banheiro")fur=`<rect x="${cx-16}" y="${fy-span*.12}" width="22" height="${span*.12}" fill="#8C6A4A"/><rect x="${cx-17}" y="${fy-span*.13}" width="24" height="${span*.02}" fill="#F4F2EE"/><ellipse cx="${cx-5}" cy="${by0+span*.12}" rx="8" ry="${span*.08}" fill="#DCE6EC" stroke="#AEB4BB" stroke-width=".8"/><rect x="${cx+10}" y="${by0+span*.02}" width="14" height="${fy-by0-span*.02}" fill="#D7E7EF" opacity=".55" stroke="#AEB4BB" stroke-width=".6"/>`+(deco==="decorar"?`<rect x="${cx-14}" y="${fy-span*.17}" width="3" height="${span*.04}" fill="#7E9A72"/><rect x="${cx+0}" y="${fy-span*.16}" width="4" height="${span*.03}" fill="#E9DCC8"/>`:"");
        if(deco==="manter")fur+=[[cx-26,fy+span*.12,"#4F8BC9"],[cx+22,fy+span*.16,"#C2564A"],[cx-6,fy+span*.18,"#8A8A8A"]].map(([x,y,c])=>`<rect x="${x}" y="${y}" width="4" height="2.4" rx=".5" fill="${c}" transform="rotate(18 ${x} ${y})"/>`).join("");
        g+=fur;
      }
      if(lit)g+=[30,50,70].map(x=>`<ellipse cx="${x}" cy="${top+span*.06}" rx="4" ry="${span*.035}" fill="#FFE29A" opacity=".75" filter="url(#${id}bs)"/>`).join("");
    }
  }
  let light="";
  if(s.imgLight==="natural"&&!ext)light=`<rect width="${W}" height="${H}" fill="url(#${id}w)"/>`;
  if(s.imgLight==="acesas")light=`<rect width="${W}" height="${H}" fill="#FFB25C" opacity=".1"/>`;
  if(s.imgLight==="hdr")light=`<rect width="${W}" height="${H}" fill="#fff" opacity=".06"/>`;
  if(s.bg==="noite"&&ext)light+=`<rect width="${W}" height="${H}" fill="#0B1430" opacity=".25"/>`;
  if(s.bg==="golden"&&ext)light+=`<rect width="${W}" height="${H}" fill="#FF9F43" opacity=".12"/>`;
  const lc={fria:["#9DBBFF",.18],quente:["#FFAA4D",.18]}[s.lightColor];
  if(lc)light+=`<rect width="${W}" height="${H}" fill="${lc[0]}" opacity="${lc[1]}"/>`;
  let icon="";
  if(!o.noIcon){
    if(s.imgLight==="natural")icon=`<circle cx="90" cy="${zy0+7}" r="4" fill="#FFD45C"/>`;
    if(s.imgLight==="acesas")icon=`<circle cx="90" cy="${zy0+7}" r="3.6" fill="#FFE29A" stroke="#7A5A00" stroke-width=".5"/><rect x="88.8" y="${zy0+10.4}" width="2.4" height="2" fill="#7A5A00"/>`;
    if(s.imgLight==="hdr")icon=`<rect x="84" y="${zy0+3}" width="12" height="7" rx="1.5" fill="#FFD45C" stroke="#7A5A00" stroke-width=".5"/><text x="90" y="${zy0+8.2}" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="3.6" font-weight="700" fill="#7A5A00">HDR</text>`;
  }
  const dark=ext&&s.bg==="noite";
  const txt=T.showText?textOverlay(s,W,H,zoneFor(s,W,H),{id,darkBg:dark,brand:"#3D4A66"}):"";
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Prévia">
    <defs><filter id="${id}bs" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.8"/></filter>
    <linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/></linearGradient>
    <linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <clipPath id="${id}c"><rect width="${W}" height="${H}"/></clipPath>${TS_FILTER(id)}</defs>
    <g clip-path="url(#${id}c)">${g}${light}${icon}${txt}</g></svg>`;
}

/* ===== componentes de escolha ===== */
function renderGroups(s,keys){
  const hide=s.mode==="img"?KIND_HIDE[kindOf(s)]:[];
  keys.filter(k=>G[k]).forEach(key=>{
    const g=s.mode==="img"?gOf(s,key):G[key];
    const box=$("g_"+key); if(!box)return;
    box.hidden=hide.includes(key); if(box.hidden)return;
    const open=box.dataset.open==="1";
    const cur=s[key];
    const chips=Object.entries(g.opts).map(([v,o])=>{
      let thumb="";
      if(g.draw==="t"){
        thumb=drawTextThumb(s,key,v);
      } else if(!g.text&&g.draw==="p"){
        const ov={...s,[key]:v,pFormat:key==="pFormat"?v:"11"};
        if(key==="pOutfit")ov.pFrame="meio";
        if(key==="pExpr")ov.pFrame="rosto";
        thumb=drawPerson(ov,{thumb:true,noIcon:key!=="pLight"});
      } else if(!g.text){
        const ov={...s,[key]:v,imgFormat:key==="imgFormat"?v:"11"};
        if(key==="bg"&&v==="scene")ov.cena=s.cena==="custom"?"wood":s.cena;
        thumb=drawScene(ov,{thumb:true,noIcon:key!=="imgLight"});
      }
      return `<button type="button" class="chip" data-k="${key}" data-v="${v}" aria-pressed="${g.multi?s[v]==="1":cur===v}" title="${esc(o.d||"")}">${thumb}<span>${esc(o.l)}</span></button>`;
    }).join("");
    const sel=g.opts[cur];
    box.innerHTML=`<div class="opthead">${esc(g.label)} <button type="button" class="qbtn" data-help="${key}" aria-expanded="${open}" aria-label="O que é ${esc(g.label)}?">?</button></div>
      ${open?`<div class="help">${esc(g.help)}</div>`:""}
      <div class="chips${g.text?" text":""}${g.draw?" visual":""}">${chips}</div>
      ${g.multi?`<div class="tipline">Toque para ligar ou desligar cada texto.</div>`:sel?`<div class="tipline"><b>${esc(sel.l)}:</b> ${esc(sel.d)}</div>`:(key==="preset"||key==="pGoal"?`<div class="tipline">Opcional. Se não souber por onde começar, escolha um.</div>`:"")}`;
  });
  $("swatchesP").innerHTML=Object.entries(BGCOLORS).map(([k,c])=>`<button type="button" class="sw" data-swp="${k}" aria-pressed="${s.pBgColor===k}" title="${c.l}" aria-label="${c.l}" style="background:${c.hex}"></button>`).join("");
  $("swatches").innerHTML=Object.entries(BGCOLORS).map(([k,c])=>`<button type="button" class="sw" data-sw="${k}" aria-pressed="${s.bgColor===k}" title="${c.l}" aria-label="${c.l}" style="background:${c.hex}"></button>`).join("");
}
document.addEventListener("click",e=>{
  const c=e.target.closest(".chip");
  if(c){
    const k=c.dataset.k,v=c.dataset.v;
    if(k==="preset"){applyPreset(v);return}
    if(k==="pGoal"){applyPGoal(v);return}
    if(G[k]&&G[k].multi){$(v).value=$(v).value==="1"?"":"1";render();return}
    $(k).value=v;
    if(k==="imgStyle"&&v==="flatlay")$("imgAngle").value="top";
    render();return;
  }
  const h=e.target.closest("[data-help]");
  if(h){const box=$("g_"+h.dataset.help);box.dataset.open=box.dataset.open==="1"?"0":"1";render();return}
  const sw=e.target.closest("[data-sw]");
  const swp=e.target.closest("[data-swp]");
  if(swp){$("pBgColor").value=swp.dataset.swp;$("pBg").value="cor";render();return}
  if(sw){$("bgColor").value=sw.dataset.sw;if(!["solid","gradient","blur"].includes($("bg").value))$("bg").value="solid";render()}
});
function applyPGoal(v){
  $("pGoal").value=v;
  Object.entries(P_PRESETS[v]).forEach(([k,val])=>{$(k).value=val});
  render(); toast("Combinação de "+G.pGoal.opts[v].l.toLowerCase()+" aplicada");
}
function applyPreset(v){
  const p=PRESETS[v]; $("preset").value=v;
  Object.entries(p).forEach(([k,val])=>{$(k).value=val});
  // se ainda estiver com o texto de exemplo, troca pelo exemplo do tipo novo
  if(clean($("visual").value)&&isExampleText($("visual").value)){
    const E=EXAMPLE_KIND[v]||{nome:EXAMPLE_IMG.nome,visual:EXAMPLE_IMG.visual,bonusVis:EXAMPLE_IMG.bonusVis,hook:EXAMPLE_IMG.hook,promessa:EXAMPLE_IMG.promessa,oferta:EXAMPLE_IMG.oferta,cta:EXAMPLE_IMG.cta};
    Object.entries(E).forEach(([k,val])=>{$(k).value=val});
  }
  render(); toast("Combinação de "+G.preset.opts[v].l.toLowerCase()+" aplicada");
}

/* ===== VÍDEO (módulo guardado) ===== */
const SCENE_L={wood:"madeira",studio:"estúdio escuro",office:"escritório",bath:"banheiro",kitchen:"cozinha"};
const rot=(keys,start,i)=>keys[(keys.indexOf(start)+i)%keys.length];
const SCENES={
  wood:"a warm oak wooden shelf against a beige plaster wall, soft sunlight through a window casting gentle leaf shadows on the wall",
  studio:"a deep navy seamless studio backdrop with a subtle glossy surface reflecting the product",
  office:"a clean modern home-office desk, softly blurred laptop and green plant in the background",
  bath:"a bright bathroom counter with soft diffused daylight and a round mirror blurred in the background",
  kitchen:"a bright modern kitchen counter, softly blurred kitchen shelves and plants in the background"
};
const STYLE="photorealistic premium commercial look, shallow depth of field, soft natural light, warm tones, smooth slow motion";
const CAMS=["very slow push-in toward the product","slow lateral dolly from left to right","slow pull-back revealing the full set","slow push-in, product centered"];
const LANG={es:"Spanish (Latin America)",pt:"Brazilian Portuguese"};
const EXAMPLE={
  nome:"7 Negocios Digitales con IA",
  visual:"a dark navy hardcover book titled '7 NEGOCIOS DIGITALES' with a large white 'IA' and blue circuit-board graphics on the cover",
  bonusVis:"a tablet and a smartphone showing the same cover, and a few printed worksheet pages",
  lang:"es",clips:"2",
  hook:"¿Y si pudieras crear tu propio negocio digital con IA?",
  promessa:"No necesitas ser experto para dar el primer paso.",
  benef:"7 negocios digitales que puedes crear con IA desde cero\nAprende a crear páginas de venta, ebooks, videos y automatizaciones",
  oferta:"Ebook + 50 prompts + 50 servicios que puedes vender con IA",
  cta:"Empieza hoy. Haz clic ahora.",
  cena:"wood",cenaCustom:"",textMode:"gemini",audio:"music",darkCta:true
};
const EXAMPLE_IMG={mode:"img",nome:"Sérum Facial Vitamina C",
  visual:"a 30 ml amber glass dropper bottle with a gold cap and a white label reading 'VITAMINA C SERUM' in black letters",
  bonusVis:"a few orange slices and the white product box",
  lang:"pt",textMode:"gemini",txtTitle:"1",txtSub:"1",txtBadge:"1",txtCta:"",txtStyle:"elegante",txtColor:"auto",txtBg:"nenhum",hook:"Pele radiante em 7 dias",promessa:"Sérum com 20% de vitamina C",oferta:"Frete grátis",cta:"Compre agora",
  imgFormat:"45",imgTextPos:"top",imgVar:"3",imgVary:"lightColor",cena:"bath",cenaCustom:"",preset:"beleza",...PRESETS.beleza};
const EXAMPLE_KIND={
  carro:{nome:"Jeep Compass 2023",visual:"a white 2023 Jeep Compass Longitude SUV with a black roof and 18-inch dark alloy wheels",bonusVis:"",hook:"Seu próximo SUV está aqui",promessa:"Revisado, com laudo cautelar aprovado",oferta:"Aceito troca",cta:"Agende o test drive"},
  imovel:{nome:"Casa térrea 3 quartos",visual:"a single-story modern house with 3 bedrooms, white facade with wood-look porcelain cladding, flat roof and a two-car garage",bonusVis:"",hook:"Sua casa nova, pronta para morar",promessa:"3 quartos, suíte e área gourmet",oferta:"Aceita financiamento",cta:"Agende sua visita"},
};
const isExampleText=v=>!clean(v)||[EXAMPLE_IMG.visual,EXAMPLE_KIND.carro.visual,EXAMPLE_KIND.imovel.visual].includes(v);
const DEFAULT_P={pGoal:"",pDesc:"",pFormat:"11",pFrame:"rosto",pOutfit:"manter",pExpr:"manter",pBg:"manter",pBgColor:"azul",pLight:"janela",pLightColor:"neutra",pRetouch:"natural",pVar:"1",pVary:"pBg"};
const EXAMPLE_P={mode:"pessoa",...DEFAULT_P,pGoal:"linkedin",...P_PRESETS.linkedin,pVar:"3",pVary:"pBg",textMode:"none",txtTitle:"1",txtSub:"",txtBadge:"",txtCta:"",hook:"",promessa:"",oferta:"",cta:""};
const DEFAULT_IMG={...DEFAULT_P,ai:"gemini",imgFormat:"45",imgStyle:"hero",imgAngle:"threeq",lightColor:"neutra",imgLight:"window",shadow:"suave",bg:"white",bgColor:"bege",surface:"infinito",depth:"desfocado",imgVar:"1",imgVary:"lightColor",imgTextPos:"top",cena:"wood",lang:"pt",textMode:"edit",clips:"2",audio:"music",txtTitle:"1",txtSub:"",txtBadge:"",txtCta:"",txtStyle:"moderna",txtColor:"auto",txtBg:"nenhum"};

function get(){const s={};FIELDS.forEach(k=>{const el=$(k);s[k]=el.type==="checkbox"?el.checked:el.value});return s}
function set(s){FIELDS.forEach(k=>{const el=$(k);if(!(k in s))return;if(el.type==="checkbox")el.checked=!!s[k];else el.value=s[k]});render()}
const words=t=>(t.trim().match(/\S+/g)||[]).length;
const clean=t=>(t||"").replace(/\s+/g," ").trim();

function beatsOf(s){
  const b=[];
  if(clean(s.hook))b.push({kind:"Gancho",text:clean(s.hook)});
  if(clean(s.promessa))b.push({kind:"Promessa",text:clean(s.promessa)});
  s.benef.split("\n").map(clean).filter(Boolean).forEach(t=>b.push({kind:"Benefício",text:t}));
  if(clean(s.oferta))b.push({kind:"Oferta",text:clean(s.oferta)});
  if(clean(s.cta))b.push({kind:"CTA",text:clean(s.cta)});
  return b;
}
function plan(s){
  const n=+s.clips, beats=beatsOf(s), clips=Array.from({length:n},()=>[]);
  beats.forEach((b,i)=>clips[Math.min(n-1,Math.floor(i*n/beats.length))].push(b));
  return clips.map((bs,ci)=>{
    const k=Math.max(bs.length,1), seg=10/k;
    bs.forEach((b,j)=>{b.t0=Math.round(j*seg*10)/10;b.t1=Math.round((j+1)*seg*10)/10;b.abs0=ci*10+b.t0;b.abs1=ci*10+b.t1});
    return bs;
  });
}
const mmss=x=>"00:"+String(Math.floor(x)).padStart(2,"0");
function sceneOf(s){return s.cena==="custom"?(clean(s.cenaCustom)||"[descreva o cenário]"):SCENES[s.cena]}
function prodOf(s){return clean(s.visual)||`[descreva o ${s.mode==="img"?KIND_NOUN[kindOf(s)]:"produto"}]`}
function actionFor(s,bs,ci,n){
  const hasOffer=bs.some(b=>b.kind==="Oferta"), last=ci===n-1, hasCta=bs.some(b=>b.kind==="CTA");
  const bonus=clean(s.bonusVis);
  if(hasOffer&&bonus) return `the product stays in place while ${bonus} smoothly appear beside it, one after another, forming a neat product group`+(last&&hasCta&&s.darkCta?`; in the final seconds the background gently darkens to a deep navy studio`:"");
  if(last&&hasCta&&s.darkCta) return `the product group stays centered while the background gradually darkens to a deep navy studio, leaving the products softly lit`;
  if(ci===0) return `the product stands still on the set; only light and camera move`;
  return `the product stands still in the same position; only light and camera move`;
}
function camFor(ci,n){if(ci===0)return CAMS[0];if(ci===n-1)return CAMS[3];return ci%2?CAMS[2]:CAMS[1]}
function audioLines(s,bs,ci,n){
  const L=LANG[s.lang];
  if(s.audio==="none")return["AUDIO: none."];
  const out=[`MUSIC: upbeat, modern instrumental corporate track, ${ci===0?"starting softly":"continuing the same track"}${ci===n-1?", resolving at the end":""}.`];
  if(s.audio==="vo") out.push(`VOICEOVER (${L}, warm confident voice, natural pace): "${bs.map(b=>b.text).join(" ")}"`);
  out.push("SFX: subtle whoosh on each text change.");
  return out;
}
function clipPrompt(s,bs,ci,n){
  const L=LANG[s.lang], P=[];
  if(ci===0)P.push(`Vertical 9:16 product advertisement, 10 seconds. Use the uploaded reference image as the exact product.`);
  else P.push(`Continue seamlessly from the last frame of the previous clip (part ${ci+1} of ${n}). Same product, same set, same lighting, no cut.`);
  P.push(`PRODUCT (identical in every frame): ${prodOf(s)}. Keep the printed design and all lettering on the product exactly as in the reference image. Do not redraw, translate or invent any text on it.`);
  P.push(`SET: ${sceneOf(s)}.`);
  P.push(`ACTION: ${actionFor(s,bs,ci,n)}.`);
  P.push(`CAMERA: ${camFor(ci,n)}. Keep the whole product in frame, no extreme close-up on printed text.`);
  P.push(`STYLE: ${STYLE}.`);
  if(s.textMode==="gemini"){
    P.push(`ON-SCREEN TEXT (${L}, spell exactly as written, bold white condensed sans-serif with key words highlighted, top third of frame, one phrase at a time, clean fade between phrases):`);
    bs.forEach(b=>P.push(`  ${b.t0}s–${b.t1}s: "${b.text}"`));
  } else P.push(`ON-SCREEN TEXT: none. Keep the top third of the frame clean for text added in editing.`);
  P.push(...audioLines(s,bs,ci,n));
  P.push(`AVOID: changing the product design, extra or garbled text, people, hands, watermarks, other brands, fast cuts.`);
  return P.join("\n");
}
function imagePrompt(s){
  const bonus=clean(s.bonusVis);
  return [`Photorealistic vertical 9:16 product photo.`,
  `${prodOf(s)}, standing upright on ${sceneOf(s)}.`,
  bonus?`Beside it: ${bonus}.`:"",
  `Use the uploaded cover image exactly. Do not change, translate or add any text on the product.`,
  `${STYLE.replace(", smooth slow motion","")}.`,
  `Leave the top third of the image empty for text. No text overlays, no people, no hands.`].filter(Boolean).join("\n");
}
function checks(s,clips){
  const C=[], beats=clips.flat();
  if(!clean(s.visual))C.push(["crit","Descreva o produto. Sem isso o Gemini inventa um produto diferente a cada clipe."]);
  else C.push(["ok","Produto descrito e travado igual em todos os clipes."]);
  if(!beats.length)C.push(["crit","Nenhum texto preenchido."]);
  if(!clean(s.cta))C.push(["warn","Sem CTA. O criativo termina sem pedir o clique."]);
  clips.forEach((bs,i)=>{
    if(bs.length>3)C.push(["warn",`Clipe ${i+1} tem ${bs.length} frases em 10 s. O ideal é até 3; aumente os clipes ou corte texto.`]);
    if(!bs.length)C.push(["warn",`Clipe ${i+1} ficou sem texto. Diminua o número de clipes.`]);
    if(s.audio==="vo"){const w=words(bs.map(b=>b.text).join(" "));if(w>25)C.push(["crit",`Narração do clipe ${i+1} tem ${w} palavras. Em 10 s cabem cerca de 25; ela vai sair cortada ou acelerada.`])}
  });
  beats.forEach(b=>{
    const w=words(b.text);
    if(s.textMode==="gemini"&&w>12)C.push(["warn",`"${b.text.slice(0,40)}…" tem ${w} palavras. Texto longo na tela é onde o modelo erra letras. Encurte ou coloque na edição.`]);
    if(s.lang==="es"&&b.text.includes("?")&&!b.text.includes("¿"))C.push(["warn",`Falta o "¿" de abertura em "${b.text}".`]);
    if(s.lang==="es"&&/\b(você|não|para você|ção)\b/i.test(b.text))C.push(["warn",`Parece português no vídeo em espanhol: "${b.text}".`]);
  });
  if(s.textMode==="gemini")C.push(["ok","Texto na tela pelo Gemini: confira acentos e ñ no primeiro clipe antes de estender."]);
  if(clean(s.oferta)&&!clean(s.bonusVis))C.push(["warn","Tem oferta mas não tem itens visuais. Sem eles, o clipe da oferta fica igual aos outros."]);
  if(s.cena==="custom"&&!clean(s.cenaCustom))C.push(["crit","Cenário personalizado vazio."]);
  C.push(["ok",`Selecione 9:16 no Gemini antes de gerar. A proporção não vai no prompt.`]);
  return C;
}

/* ===== IMAGEM: prompt, variações e conferência ===== */
const VARY_KEYS={lightColor:Object.keys(G.lightColor.opts),imgLight:Object.keys(G.imgLight.opts),imgAngle:Object.keys(G.imgAngle.opts),bg:["white","solid","gradient","blur","scene"],surface:Object.keys(G.surface.opts)};
function imgVariants(s){
  const n=+s.imgVar, out=[];
  for(let i=0;i<n;i++){
    const v={...s};
    if(i>0){
      const kd=kindOf(s);
      let keys=kd==="produto"?VARY_KEYS[s.imgVary]:Object.keys(gOf(s,s.imgVary).opts);
      if(kd==="produto"&&s.imgVary==="imgAngle"&&s.imgStyle==="flatlay")keys=["top","macro"];
      if(kd==="imovel"&&s.imgVary==="imgAngle"&&s.imgStyle!=="fachada")keys=keys.filter(k=>k!=="drone");
      if(kd==="carro"&&s.imgVary==="surface"&&["estudio","estudioclaro","solid","showroom"].includes(s.bg))keys=keys.filter(k=>k!=="terra"&&k!=="asfalto");
      if(kd==="carro"&&s.imgVary==="surface"&&["estrada","urbano","garagem"].includes(s.bg))keys=keys.filter(k=>k!=="concreto"&&k!=="estudio");
      v[s.imgVary]=rot(keys,keys.includes(s[s.imgVary])?s[s.imgVary]:keys[0],i);
    }
    out.push(v);
  }
  return out;
}
function bgPrompt(s){
  const c=(BGCOLORS[s.bgColor]||BGCOLORS.bege).p;
  return {white:"seamless pure white infinite background (cyclorama), no visible horizon line",
    solid:`seamless solid ${c} background`,
    gradient:`smooth gradient background from light ${c} to a deeper ${c}`,
    blur:`softly blurred ${c} background with gentle bokeh light spots`,
    scene:sceneOf(s)}[s.bg];
}
function fmtFor(s,key){
  const f=s[key||"imgFormat"];
  if(s.ai==="chatgpt")return f==="11"?"square 1:1":"tall portrait 2:3";
  return G.imgFormat.opts[f].p;
}
function imgParts(s){
  const angle=s.imgStyle==="flatlay"&&!["top","macro"].includes(s.imgAngle)?G.imgAngle.opts.top.p:G.imgAngle.opts[s.imgAngle].p;
  const surface=(s.imgStyle==="flatlay"||s.imgAngle==="top")&&s.surface==="pedestal"?G.surface.opts.infinito.p:G.surface.opts[s.surface].p;
  const avoid=["changes to the product design","extra or garbled text","watermarks","logos of other brands","cluttered background"].concat(s.imgStyle==="lifestyle"?["deformed fingers","extra fingers"]:["people","hands"]);
  return {...txtZoneInfo(s),angle,surface,avoid,bonus:clean(s.bonusVis)};
}
function staticPrompt(s){
  const kd=kindOf(s);
  if(kd==="carro")return carPrompt(s);
  if(kd==="imovel")return housePrompt(s);
  const x=imgParts(s);return s.ai==="midjourney"?mjPrompt(s,x):naturalPrompt(s,x)}
const cap=t=>t[0].toUpperCase()+t.slice(1);
function carBg(s){return s.bg==="solid"?`a seamless solid ${(BGCOLORS[s.bgColor]||BGCOLORS.cinza).p} automotive studio cyclorama`:KIND_G.carro.bg.opts[s.bg].p}
function carPrompt(s){
  const K=KIND_G.carro, x=txtZoneInfo(s), bonus=clean(s.bonusVis), sepNeg=s.ai==="leonardo"||s.ai==="ideogram";
  const inside=s.imgStyle==="interior", detail=s.imgStyle==="detalhe";
  const st=K.imgStyle.opts[s.imgStyle].p, ang=K.imgAngle.opts[s.imgAngle].p, li=K.imgLight.opts[s.imgLight].p, lc=G.lightColor.opts[s.lightColor].p;
  const avoid=["changing the car model or design","distorted or mismatched wheels","warped body panels","wrong or invented logos and badges","extra doors or mirrors","readable license plate numbers","a miniature, toy or scale-model look","the car placed on a table, shelf or countertop","wooden, marble or fabric surfaces under the car","people","watermarks"].concat(x.wantText?["extra or garbled text"]:["text"]);
  if(s.ai==="midjourney"){
    const ar={"45":"4:5","916":"9:16","11":"1:1"}[s.imgFormat];
    const bits=[`automotive advertising photo of ${prodOf(s)}`,st,inside?`${carBg(s)} seen through the windshield`:carBg(s),inside?"":`on ${K.surface.opts[s.surface].p}`,inside?"":ang,li,lc,
      inside?"":K.shadow.opts[s.shadow].p,K.depth.opts[s.depth].p,inside||detail?"":"full-size real vehicle at real-world scale, all four tires on the ground","high-end automotive photography, glossy paint with realistic reflections",
      x.wantText&&x.h?`${G.txtStyle.opts[s.txtStyle].p} headline text "${x.h}" ${G.txtColor.opts[s.txtColor].p} in the ${x.textZone}, car in the ${x.prodZone}`:(x.space?`empty ${x.textZone} for text, car in the ${x.prodZone}`:"")];
    const no=["miniature","toy","table","wood","marble","people","watermark","logo","license plate numbers"].concat(x.wantText?[]:["text","letters"]);
    return {p:`${bits.filter(Boolean).join(", ")} --ar ${ar} --style raw --no ${no.join(", ")}`,neg:""};
  }
  const P=[`A photorealistic automotive advertising photo, ${fmtFor(s)} format.`];
  P.push(`SUBJECT: ${st}. The car is ${prodOf(s)}.`);
  P.push(s.ai==="outra"||s.ai==="ideogram"
    ?`If a reference photo of the car is attached, use it as the exact car: same make, model, body shape, paint color, wheels, headlights, grille and badges.`
    :`Use the attached photo as the exact car: keep the same make, model, body shape, paint color, wheels, headlights, grille and badges identical. Do not turn it into a different car or invent any text on it.`);
  if(bonus)P.push(`Also in the scene: ${bonus}.`);
  if(!inside)P.push(`SCALE: a real full-size vehicle at true real-world scale${detail?"":", all four tires resting on the ground"}. Never a miniature, toy or scale model, never on a table, shelf or countertop.`);
  P.push(inside?`SEEN THROUGH THE WINDSHIELD AND WINDOWS: ${carBg(s)}.`:`LOCATION: ${carBg(s)}.`);
  if(!inside)P.push(`GROUND: ${K.surface.opts[s.surface].p}.`);
  P.push(`COMPOSITION: ${inside||detail?"":ang+". "}`+(x.space?`Car placed in the ${x.prodZone} of the frame, fully visible and sharp. Keep the ${x.textZone} clean and uncluttered for text.`:`Car centered in the frame, ${detail?"sharp":"fully visible and sharp, with some breathing room around it"}.`));
  P.push(`LIGHT: ${li}. ${cap(lc)}.`);
  if(!inside)P.push(`SHADOW: ${K.shadow.opts[s.shadow].p}.`);
  P.push(`FOCUS: ${K.depth.opts[s.depth].p}.`);
  P.push(`STYLE: high-end automotive photography, clean glossy paint with realistic reflections, accurate proportions and panel gaps, sharp detail.`);
  if(!inside&&!detail)P.push(`LICENSE PLATE: blank or softly blurred, no readable numbers.`);
  P.push(...textLines(s,x));
  if(!sepNeg)P.push(`AVOID: ${avoid.join(", ")}.`);
  return {p:P.join("\n"),neg:sepNeg?avoid.join(", "):""};
}
function housePrompt(s){
  const K=KIND_G.imovel, x=txtZoneInfo(s), bonus=clean(s.bonusVis), sepNeg=s.ai==="leonardo"||s.ai==="ideogram";
  const facade=s.imgStyle==="fachada", outdoor=facade||s.imgStyle==="gourmet";
  const pick=(o)=>outdoor&&o.pExt?o.pExt:o.p;
  const ang=s.imgAngle==="drone"&&!facade?K.imgAngle.opts.diagonal:K.imgAngle.opts[s.imgAngle];
  const angP=facade?ang.pExt:ang.p;
  const deco=facade?K.surface.opts[s.surface].pExt:K.surface.opts[s.surface].p;
  const li=pick(K.imgLight.opts[s.imgLight]), lc=G.lightColor.opts[s.lightColor].p, sky=K.bg.opts[s.bg].p;
  const desc=clean(s.visual);
  const avoid=["changing the architecture","adding or removing rooms, floors, windows or doors","tilted or curved vertical lines","fisheye distortion","blown-out white windows","dark corners","people","pets","watermarks"].concat(x.wantText?["extra or garbled text"]:["text"]);
  if(s.ai==="midjourney"){
    const ar={"45":"4:5","916":"9:16","11":"1:1"}[s.imgFormat];
    const bits=[`professional real estate photo, ${K.imgStyle.opts[s.imgStyle].p}`,desc,outdoor?sky:`${sky} seen through the windows`,deco,angP,li,lc,
      "wide-angle 16-24mm lens, straight vertical lines, everything in sharp focus, bright and clean, HDR-balanced exposure",
      x.wantText&&x.h?`${G.txtStyle.opts[s.txtStyle].p} headline text "${x.h}" ${G.txtColor.opts[s.txtColor].p} in the ${x.textZone}`:(x.space?`empty ${x.textZone} for text`:"")];
    const no=["people","watermark","fisheye","tilted lines","clutter"].concat(x.wantText?[]:["text","letters"]);
    return {p:`${bits.filter(Boolean).join(", ")} --ar ${ar} --style raw --no ${no.join(", ")}`,neg:""};
  }
  const P=[`A photorealistic professional real estate photo, ${fmtFor(s)} format.`];
  P.push(`SUBJECT: ${K.imgStyle.opts[s.imgStyle].p}.`+(desc?` The property: ${desc}.`:""));
  P.push(s.ai==="outra"||s.ai==="ideogram"
    ?`If a photo of the property is attached, use it as the exact reference: same architecture, walls, windows, doors, roof, floor, finishes and proportions. Do not add or remove rooms, floors, windows or doors.`
    :`Use the attached photo as the exact property: keep the same architecture, walls, windows, doors, roof, floor, finishes and room proportions. Do not add or remove rooms, floors, windows or doors.`);
  if(bonus)P.push(`Also in the scene: ${bonus}.`);
  P.push(`${outdoor?"SKY AND TIME OF DAY":"VIEW THROUGH THE WINDOWS"}: ${sky}.`);
  P.push(`${facade?"LANDSCAPING":"FURNITURE AND DECOR"}: ${deco}.`);
  P.push(`COMPOSITION: ${angP}. Vertical lines perfectly straight and parallel, no keystone tilt.`+(x.space?` Keep the ${x.textZone} clean and uncluttered for text.`:""));
  P.push(`LIGHT: ${li}. ${cap(lc)}.`);
  P.push(`STYLE: professional real estate photography, wide-angle 16-24mm lens on a full-frame camera, everything in sharp focus, bright and clean, true-to-life colors and materials.`);
  P.push(...textLines(s,x));
  if(!sepNeg)P.push(`AVOID: ${avoid.join(", ")}.`);
  return {p:P.join("\n"),neg:sepNeg?avoid.join(", "):""};
}
function carChecks(s){
  const C=[], st=["estudio","estudioclaro","solid","showroom"].includes(s.bg), out=["estrada","urbano","garagem"].includes(s.bg);
  if(!clean(s.visual))C.push(["crit","Descreva o carro: marca, modelo, ano e cor. Sem isso a IA inventa outro carro."]);
  else C.push(["ok","Carro descrito e travado igual em todas as variações."]);
  if(s.imgStyle!=="interior")C.push(["ok","O prompt trava o carro em tamanho real, com os 4 pneus no chão, e proíbe mesa, madeira e mármore."]);
  if(s.ai==="midjourney")C.push(["warn","O Midjourney não copia o modelo exato: muda grade, roda e farol. Para anúncio do carro real, use Gemini ou ChatGPT com a foto."]);
  if(s.imgStyle==="movimento"&&st)C.push(["warn","Carro em movimento dentro de estúdio ou showroom não faz sentido. Use estrada ou cidade."]);
  if(s.surface==="terra"&&st)C.push(["warn","Estrada de terra não combina com estúdio ou showroom. Use piso de estúdio ou de showroom."]);
  if((s.surface==="concreto"||s.surface==="estudio")&&out)C.push(["warn","Piso de showroom ou de estúdio na rua fica estranho. Use asfalto ou estrada de terra."]);
  if(s.surface==="asfalto"&&st)C.push(["warn","Asfalto dentro de estúdio ou showroom fica estranho. Use piso de estúdio ou de showroom."]);
  if((s.bg==="estudio"||s.bg==="estudioclaro"||s.bg==="solid"||s.bg==="showroom")&&(s.imgLight==="sol"||s.imgLight==="golden"))C.push(["warn","Sol e pôr do sol são luz de rua. Em estúdio ou showroom, use luz de estúdio ou dia nublado."]);
  if(s.bg==="urbano"&&s.imgLight!=="noite")C.push(["warn","Cidade à noite pede a luz “Noite”."]);
  if(s.imgLight==="noite"&&!["urbano","estudio","garagem","estrada"].includes(s.bg))C.push(["warn","Luz de noite com esse cenário fica escura demais. Combine com cidade à noite ou estúdio escuro."]);
  if(s.surface==="molhado"&&s.imgLight==="sol")C.push(["warn","Asfalto molhado com sol forte fica estranho. Combina com noite, pôr do sol ou nublado."]);
  if(s.imgLight==="sol")C.push(["ok","Sol forte reflete muito na lataria. Se sair estourado, troque para dia nublado."]);
  if(s.imgStyle==="interior")C.push(["ok","Foto do interior: chão, sombra e ângulo externo não entram no prompt. O cenário aparece pelo para-brisa."]);
  if(s.imgStyle!=="interior"&&s.imgStyle!=="detalhe")C.push(["ok","A placa sai sem números legíveis."]);
  return C;
}
function houseChecks(s){
  const C=[], facade=s.imgStyle==="fachada";
  if(!clean(s.visual))C.push(["warn","Descreva o imóvel, ex.: casa térrea de 3 quartos, fachada branca com revestimento amadeirado. Ajuda a IA a não mudar a arquitetura."]);
  else C.push(["ok","Imóvel descrito."]);
  C.push(["ok","O prompt trava paredes, janelas, portas e telhado. A IA não pode inventar cômodo nem janela."]);
  if(s.surface==="decorar"||s.surface==="vazio")C.push(["warn","A IA vai "+(s.surface==="decorar"?(facade?"fazer um jardim que não existe":"colocar móveis que não existem"):"tirar os móveis")+". No anúncio, escreva “imagem ilustrativa” para não enganar o comprador."]);
  if(s.imgAngle==="drone"&&!facade)C.push(["warn","Drone só serve para fachada. No ambiente interno, o prompt usa a vista do canto."]);
  if(s.bg==="noite"&&s.imgLight==="natural")C.push(["warn","Anoitecer com luz natural fica escuro. Use “Luzes acesas”."]);
  if(s.ai==="midjourney")C.push(["warn","O Midjourney cria outra casa. Para anunciar o imóvel real, use Gemini ou ChatGPT com a foto."]);
  C.push(["ok","Na foto de referência, segure o celular reto, na altura do peito, sem inclinar. Linha reta na foto ajuda a IA a manter tudo reto."]);
  return C;
}
function naturalPrompt(s,x){
  const L=LANG[s.lang], sepNeg=s.ai==="leonardo"||s.ai==="ideogram";
  const lc=G.lightColor.opts[s.lightColor].p;
  const P=[];
  P.push(`A photorealistic commercial advertising photo, ${fmtFor(s)} format.`);
  P.push(`SUBJECT: ${G.imgStyle.opts[s.imgStyle].p}. The product is ${prodOf(s)}.`);
  P.push(s.ai==="outra"||s.ai==="ideogram"
    ?`If a reference photo of the product is attached, use it as the exact product: keep its shape, colors, proportions and all printed lettering identical. Do not invent any text on it.`
    :`Use the attached photo as the exact product: keep its shape, colors, proportions and all printed lettering identical. Do not redraw, translate or invent any text on it.`);
  if(x.bonus&&s.imgStyle!=="hero")P.push(`Around it: ${x.bonus}.`);
  P.push(`BACKGROUND: ${bgPrompt(s)}.`);
  P.push(`SURFACE: ${x.surface}.`);
  P.push(`COMPOSITION: ${x.angle}. `+(x.space?`Product placed in the ${x.prodZone} of the frame, fully visible and sharp. Keep the ${x.textZone} clean and uncluttered for text.`:`Product centered in the frame, fully visible and sharp.`));
  P.push(`LIGHT: ${G.imgLight.opts[s.imgLight].p}. ${lc[0].toUpperCase()+lc.slice(1)}.`);
  P.push(`SHADOW: ${G.shadow.opts[s.shadow].p}.`);
  P.push(`FOCUS: ${G.depth.opts[s.depth].p}.`);
  P.push(`STYLE: premium commercial product photography, crisp product detail, realistic textures and reflections, color palette that harmonizes with the product.`);
  P.push(...textLines(s,x));
  if(!sepNeg)P.push(`AVOID: ${x.avoid.join(", ")}.`);
  return {p:P.join("\n"),neg:sepNeg?x.avoid.join(", "):""};
}
function mjPrompt(s,x){
  const ar={"45":"4:5","916":"9:16","11":"1:1"}[s.imgFormat];
  const bits=[`commercial product photo of ${prodOf(s)}`,G.imgStyle.opts[s.imgStyle].p,
    x.bonus&&s.imgStyle!=="hero"?`surrounded by ${x.bonus}`:"",bgPrompt(s),x.surface,x.angle,
    G.imgLight.opts[s.imgLight].p,G.lightColor.opts[s.lightColor].p,G.shadow.opts[s.shadow].p,G.depth.opts[s.depth].p,
    x.wantText&&x.h?`${G.txtStyle.opts[s.txtStyle].p} headline text "${x.h}" ${G.txtColor.opts[s.txtColor].p} in the ${x.textZone}, product in the ${x.prodZone}`:(x.space?`empty ${x.textZone} for text, product in the ${x.prodZone}`:""),
    "premium product photography, crisp detail, realistic textures"];
  const no=["watermark","logo","clutter"].concat(s.imgStyle==="lifestyle"?[]:["people","hands"]).concat(x.wantText?[]:["text","letters"]);
  return {p:`${bits.filter(Boolean).join(", ")} --ar ${ar} --style raw --no ${no.join(", ")}`,neg:""};
}
function variantLabel(v,s){const g=gOf(s,s.imgVary);return g&&g.opts[v[s.imgVary]]?g.opts[v[s.imgVary]].l.toLowerCase():""}
function imgChecks(s,fixed=[]){
  const kd=kindOf(s);
  if(kd!=="produto"){
    const C=kd==="carro"?carChecks(s):houseChecks(s);
    if(fixed.length)C.push(["warn",`Algumas escolhas não servem para ${KIND_NOUN[kd]} e foram trocadas: `+fixed.map(([k,old])=>`${((G[k].opts[old])||{}).l||old} → ${gOf(s,k).opts[s[k]].l}`).join(", ")+"."]);
    C.push(...textChecks(s,true));
    if(s.ai==="chatgpt"&&s.imgFormat!=="11")C.push(["ok",`O ChatGPT gera em retrato 2:3. O prompt já pede isso; recorte para ${G.imgFormat.opts[s.imgFormat].l} no Canva.`]);
    if(s.ai==="leonardo"||s.ai==="ideogram")C.push(["ok","Esta IA tem campo separado para o que evitar. O gerador já separou o “negative prompt” embaixo de cada variação."]);
    if(+s.imgVar>1)C.push(["ok","As variações mudam uma coisa só. No teste, você sabe o que fez a imagem vencer."]);
    return C;
  }
  const C=[];
  if(!clean(s.visual))C.push(["crit","Descreva o produto. Sem isso a IA inventa um produto diferente em cada variação."]);
  else C.push(["ok","Produto descrito e travado igual em todas as variações."]);
  C.push(...textChecks(s,s.bg==="scene"||s.bg==="blur"));
  if(s.ai==="midjourney")C.push(["warn","O Midjourney recria o produto e pode mudar rótulo e formato. Bom para cenário e foto conceito. Para anúncio com o produto real, prefira Gemini ou ChatGPT."]);
  if(s.ai==="chatgpt"&&s.imgFormat!=="11")C.push(["ok",`O ChatGPT gera em retrato 2:3. O prompt já pede isso; recorte para ${G.imgFormat.opts[s.imgFormat].l} no Canva.`]);
  if(s.ai==="leonardo"||s.ai==="ideogram")C.push(["ok","Esta IA tem campo separado para o que evitar. O gerador já separou o “negative prompt” embaixo de cada variação."]);
  if(s.imgStyle==="bundle"&&!clean(s.bonusVis))C.push(["warn","Tipo “com itens” sem itens descritos. Preencha os itens ou troque o tipo de cena."]);
  if(s.imgLight==="dramatic"&&s.bg==="white")C.push(["warn","Luz dramática com fundo branco briga: a luz pede fundo escuro. Troque o fundo para cor sólida preta ou a luz para estúdio."]);
  if(s.imgLight==="dramatic"&&s.lightColor==="quente"&&s.bgColor!=="preto")C.push(["ok","Luz dramática quente dá clima de luxo. Fica ainda melhor com fundo escuro."]);
  if(s.surface==="espelho"&&s.shadow==="marcada")C.push(["warn","Espelho com sombra marcada costuma sair confuso. Use sombra suave ou quase nenhuma."]);
  if(s.bg==="white"&&s.lightColor==="quente")C.push(["warn","Fundo branco com luz amarela fica creme, não branco. Se quer branco puro, use luz neutra."]);
  if(s.imgStyle==="flatlay"&&s.surface==="pedestal")C.push(["ok","Pedestal não aparece em foto de cima; o prompt usa o fundo liso no lugar."]);
  if(s.imgStyle==="lifestyle")C.push(["ok","Produto em uso tem mãos: se os dedos saírem estranhos, peça “fix the fingers” na mesma conversa."]);
  if(s.bg==="scene"&&s.cena==="custom"&&!clean(s.cenaCustom))C.push(["crit","Cenário personalizado vazio."]);
  if(+s.imgVar>1)C.push(["ok","As variações mudam uma coisa só. No teste, você sabe o que fez a imagem vencer."]);
  C.push(["ok",`Use a foto real do produto como referência sempre que a IA permitir. Formato: ${G.imgFormat.opts[s.imgFormat].l}.`]);
  return C;
}
function drawChecks(C){
  const worst=C.some(c=>c[0]==="crit")?"crit":C.some(c=>c[0]==="warn")?"warn":"ok";
  $("verdict").className="verdict "+worst;
  $("verdict").textContent={ok:"Pode gerar",warn:"Revise os avisos",crit:"Não gere ainda"}[worst];
  const order={crit:0,warn:1,ok:2};
  $("checks").innerHTML=C.sort((a,b)=>order[a[0]]-order[b[0]]).map(([k,t])=>`<li><span class="pill ${k}">${k==="crit"?"Erro":k==="warn"?"Aviso":"OK"}</span><span>${esc(t)}</span></li>`).join("");
}
function drawTakes(takes){
  window.__takes=takes;
  $("takes").innerHTML=takes.map((k,i)=>`<div class="take"><div class="takehead"><span class="t">${esc(k.t)}</span><span class="r"><span class="m">${esc(k.m)} · ${words(k.p)} palavras</span><button type="button" data-copy="${i}">Copiar</button></span></div><pre>${esc(k.p)}</pre>${k.neg?`<div class="takehead negh"><span class="m">Negative prompt · cole no campo separado</span><button type="button" data-copyneg="${i}">Copiar</button></div><pre>${esc(k.neg)}</pre>`:""}</div>`).join("");
}
function renderImg(s){
  const fixed=normalizeKind(s), kd=kindOf(s), noun=KIND_NOUN[kd], L=k=>gOf(s,k);
  renderGroups(s,IMG_KEYS);
  $("bgColorWrap").hidden=!["solid","gradient","blur"].includes(s.bg);
  $("cenaSlotImg").appendChild($("cenaBox"));
  $("cenaBox").hidden=s.bg!=="scene";
  $("bigPreview").innerHTML=drawScene(s);
  // rótulos que mudam com o tipo
  $("lgProd").textContent={produto:"Produto",carro:"O carro",imovel:"O imóvel"}[kd];
  $("lbNome").textContent={produto:"Nome do produto",carro:"Modelo do carro",imovel:"Nome do imóvel"}[kd];
  $("lbVisual").textContent={produto:"Como o produto é visualmente",carro:"Como o carro é",imovel:"Como o imóvel é"}[kd];
  $("smVisual").textContent={produto:"Em inglês ou português. Cor, formato, material, o que está escrito no rótulo.",carro:"Marca, modelo, ano, cor, rodas. Ex.: Toyota Hilux 2024 prata, rodas aro 18 escuras.",imovel:"Tipo, cômodos e acabamento. Ex.: casa térrea 3 quartos, fachada branca com porcelanato amadeirado."}[kd];
  $("visual").placeholder=kd==="carro"?"Ex.: Jeep Compass 2023 branco, teto preto":kd==="imovel"?"Ex.: sobrado 2 andares, fachada cinza e madeira":"";
  $("lgFundo").textContent={produto:"6 · Fundo e superfície",carro:"6 · Cenário e chão",imovel:"6 · Céu, horário e decoração"}[kd];
  const VL={lightColor:"A cor da luz",imgLight:"O tipo de luz",imgAngle:"O ângulo",
    bg:{produto:"O fundo",carro:"O cenário",imovel:"O céu / horário"}[kd],surface:{produto:"A superfície",carro:"O chão",imovel:"A decoração"}[kd]};
  [...$("imgVary").options].forEach(op=>{op.textContent=VL[op.value]});
  const R=[["IA",G.ai.opts[s.ai].l],[kd==="imovel"?"Mostrar":"Cena",L("imgStyle").opts[s.imgStyle].l],["Ângulo",L("imgAngle").opts[s.imgAngle].l],["Luz",L("imgLight").opts[s.imgLight].l+", "+G.lightColor.opts[s.lightColor].l.toLowerCase()],
    [L("bg").label,L("bg").opts[s.bg].l+(["solid","gradient","blur"].includes(s.bg)?" "+BGCOLORS[s.bgColor].l:"")+(s.bg==="scene"?" ("+(SCENE_L[s.cena]||"personalizado")+")":"")],
    [kd==="produto"?"Superfície":L("surface").label,L("surface").opts[s.surface].l]]
    .concat(KIND_HIDE[kd].includes("shadow")?[]:[["Sombra",L("shadow").opts[s.shadow].l]])
    .concat(KIND_HIDE[kd].includes("depth")?[]:[["Foco",L("depth").opts[s.depth].l]])
    .concat([["Texto",textSummary(s)]]);
  $("recipe").innerHTML=R.map(([a,b])=>`<li><span>${a}</span><span>${esc(b)}</span></li>`).join("");
  drawChecks(imgChecks(s,fixed));
  const vs=imgVariants(s), n=vs.length;
  const fl=G.imgFormat.opts[s.imgFormat].l;
  const BY_AI={
    gemini:[`No Gemini, peça para criar uma imagem, anexe a foto do ${noun} e cole a Variação A.`,`Ajuste conversando, sem reescrever o prompt: “deixe a luz mais quente”, “aproxime o ${noun}”, “troque o fundo para rosa”.`],
    chatgpt:[`No ChatGPT, clique no + para anexar a foto do ${noun} e cole a Variação A.`,`Ajuste conversando: “deixe a luz mais quente”, “aproxime o ${noun}”.`].concat(s.imgFormat!=="11"?[`O ChatGPT entrega em retrato 2:3. Recorte para ${fl} no Canva.`]:[]),
    midjourney:[`Arraste a foto do ${noun} para a caixa do prompt e use como referência (Omni Reference ou Image Prompt).`,`Cole a Variação A. O formato já vai no final do prompt (--ar).`,`Para ajustar, use Vary (Subtle) ou troque uma palavra do prompt.`],
    leonardo:[`Escolha a proporção ${fl} no painel e adicione a foto do ${noun} como referência de imagem.`,`Cole a Variação A no campo do prompt e o negative prompt no campo separado.`],
    ideogram:[`Escolha a proporção ${fl} e, se o seu plano permitir, envie a foto do ${noun} como referência.`,`Cole a Variação A no prompt e o negative prompt no campo separado, se aparecer.`],
    outra:[`Se a IA aceitar foto, anexe a foto do ${noun} como referência. Escolha a proporção ${fl}, se houver essa opção.`,`Cole a Variação A. Se a IA tiver campo de “negative prompt”, cole ali o que está na linha AVOID.`],
  };
  const steps=[{produto:`Tire uma foto do produto com o celular, com boa luz e fundo limpo.`,carro:`Fotografe o carro inteiro com o celular, de dia, limpo e no mesmo ângulo que escolheu.`,imovel:`Fotografe ${s.imgStyle==="fachada"?"a frente do imóvel":"o ambiente"} com o celular na horizontal e reto, na altura do peito, com as janelas abertas.`}[kd],...BY_AI[s.ai]];
  if(n>1)steps.push(`Gere ${n>2?"as outras variações":"a Variação B"} do mesmo jeito, com a mesma foto, e compare.`);
  if(s.textMode==="edit")steps.push(`No Canva, escreva os textos no espaço livre com a fonte ${G.txtStyle.opts[s.txtStyle].canva}.`);
  steps.push(`Deu certo? Salve na biblioteca abaixo.`);
  $("steps").innerHTML=steps.map(t=>`<li>${esc(t)}</li>`).join("");
  drawTakes(vs.map((v,i)=>({t:`Variação ${"ABCD"[i]}${n>1?" · "+variantLabel(v,s):""}`,m:`${G.ai.opts[s.ai].l} · ${fl}`,...staticPrompt(v)})));
}

/* ===== FOTO DE PESSOA: prompt, variações e conferência ===== */
function pBgPrompt(s){return s.pBg==="cor"?`a seamless solid ${(BGCOLORS[s.pBgColor]||BGCOLORS.azul).p} studio background`:G.pBg.opts[s.pBg].p}
function personPrompt(s){
  const goal=s.pGoal?G.pGoal.opts[s.pGoal].p:"a professional, natural-looking portrait";
  const desc=clean(s.pDesc);
  const x=txtZoneInfo(s);
  const avoid=["changing the face or identity","altering body shape","plastic or overly smooth skin","distorted hands","extra fingers","warped background"].concat(x.wantText?["extra or garbled text","watermarks"]:["text","watermarks"]);
  if(s.ai==="midjourney"){
    const ar={"45":"4:5","916":"9:16","11":"1:1"}[s.pFormat];
    const bits=[`professional portrait photo of ${desc||"the person in the reference image"}`,G.pFrame.opts[s.pFrame].p,
      s.pOutfit==="manter"?"":G.pOutfit.opts[s.pOutfit].p,s.pExpr==="manter"?"":G.pExpr.opts[s.pExpr].p,
      s.pBg==="manter"?"":pBgPrompt(s),G.pLight.opts[s.pLight].p,G.pLightColor.opts[s.pLightColor].p,
      "85mm portrait lens, realistic skin texture, sharp eyes",
      x.wantText&&x.h?`${G.txtStyle.opts[s.txtStyle].p} headline text "${x.h}" ${G.txtColor.opts[s.txtColor].p} in the ${x.textZone}, person in the ${x.prodZone}`:(x.space?`empty ${x.textZone} for text, person in the ${x.prodZone}`:"")];
    return {p:`${bits.filter(Boolean).join(", ")} --ar ${ar} --style raw --no ${x.wantText?"":"text, "}watermark, plastic skin`,neg:""};
  }
  const sepNeg=s.ai==="leonardo"||s.ai==="ideogram", lc=G.pLightColor.opts[s.pLightColor].p;
  const P=[`A photorealistic professional portrait photo, ${fmtFor(s,"pFormat")} format.`,`PURPOSE: ${goal}.`];
  P.push(s.ai==="outra"||s.ai==="ideogram"
    ?`PERSON: If a photo of the person is attached, use it as the exact reference: keep the same face, facial features, identity, age, skin tone, hairstyle, body shape and proportions.`
    :`PERSON: Use the attached photo as the exact reference for the person: keep the same face, facial features, identity, age, skin tone, hairstyle, body shape and proportions. It must clearly be the same person.`);
  if(desc)P.push(`The person: ${desc}.`);
  P.push(`FRAMING: ${G.pFrame.opts[s.pFrame].p}, the person ${x.space?`placed in the ${x.prodZone} of the frame`:"centered"} and looking at the camera, natural relaxed posture.`+(x.space?` Keep the ${x.textZone} clean and uncluttered for text.`:""));
  P.push(`CLOTHING: ${G.pOutfit.opts[s.pOutfit].p}.`);
  P.push(`EXPRESSION: ${G.pExpr.opts[s.pExpr].p}.`);
  P.push(`BACKGROUND: ${pBgPrompt(s)}.`);
  P.push(`LIGHT: ${G.pLight.opts[s.pLight].p}. ${lc[0].toUpperCase()+lc.slice(1)}.`);
  P.push(`SKIN: ${G.pRetouch.opts[s.pRetouch].p}.`);
  P.push(`STYLE: shot on a full-frame camera with an 85mm portrait lens, sharp focus on the eyes, realistic skin texture, natural colors, high resolution.`);
  P.push(...textLines(s,x));
  if(!sepNeg)P.push(`AVOID: ${avoid.join(", ")}.`);
  return {p:P.join("\n"),neg:sepNeg?avoid.join(", "):""};
}
const VARY_P={pBg:Object.keys(G.pBg.opts).filter(k=>k!=="manter"),pOutfit:Object.keys(G.pOutfit.opts).filter(k=>k!=="manter"),pLight:Object.keys(G.pLight.opts),pLightColor:Object.keys(G.pLightColor.opts)};
function pVariants(s){
  const n=+s.pVar, out=[], keys=VARY_P[s.pVary], k=s.pVary;
  for(let i=0;i<n;i++){const v={...s};if(i>0)v[k]=rot(keys,keys.includes(s[k])?s[k]:keys[0],keys.includes(s[k])?i:i-1);out.push(v)}
  return out;
}
function pChecks(s){
  const C=[], fl=G.pFormat.opts[s.pFormat].l;
  C.push(["ok","Use uma foto sua ou de alguém que autorizou."]);
  C.push(["ok","Foto de referência com o rosto bem visível, de frente e com boa luz. Quanto melhor a original, mais parecida a pessoa sai."]);
  if(s.pFrame==="inteiro")C.push(["warn","Corpo inteiro só fica fiel se a foto original mostrar o corpo todo. Se não mostrar, a IA inventa o corpo."]);
  if(s.ai==="midjourney")C.push(["warn","O Midjourney cria uma pessoa parecida, não a mesma. Para manter o rosto, prefira Gemini ou ChatGPT."]);
  if((s.ai==="midjourney"||s.ai==="outra")&&!clean(s.pDesc))C.push(["warn","Preencha “Como a pessoa é”. Se a IA não aceitar a foto, é só pela descrição que ela sabe quem desenhar."]);
  if(s.ai==="gemini"||s.ai==="chatgpt")C.push(["ok","Se o rosto mudar, peça na mesma conversa: “mantenha o rosto exatamente igual ao da foto original”."]);
  if(s.pBg==="manter"&&s.pOutfit==="manter"&&s.pExpr==="manter")C.push(["ok","Modo “só melhorar”: a IA mexe só em luz, nitidez e cor. É o resultado mais fiel."]);
  if(s.pLight==="dramatica"&&s.pBg==="branco")C.push(["warn","Luz dramática com fundo branco briga. Use fundo escuro ou estúdio cinza."]);
  if(s.pLight==="golden"&&["estudio","branco","cor"].includes(s.pBg))C.push(["warn","Pôr do sol é luz de ar livre. Com fundo de estúdio fica artificial; use ar livre ou cidade."]);
  if(s.pRetouch==="nenhum"&&s.pGoal==="linkedin")C.push(["ok","Sem retoque fica mais real. Se a pele brilhar na foto, use “Leve”."]);
  if(s.ai==="chatgpt"&&s.pFormat!=="11")C.push(["ok",`O ChatGPT gera em retrato 2:3. O prompt já pede isso; recorte para ${fl} no Canva.`]);
  if(s.ai==="leonardo"||s.ai==="ideogram")C.push(["ok","Esta IA tem campo separado para o que evitar. O gerador já separou o “negative prompt” embaixo de cada variação."]);
  if(+s.pVar>1)C.push(["ok","As variações mudam uma coisa só. Fica fácil comparar e escolher."]);
  C.push(...textChecks(s,["manter","escritorio","externo","cidade"].includes(s.pBg)));
  if(s.textMode!=="none"&&s.pFrame==="rosto"&&s.imgTextPos==="top")C.push(["warn","Texto em cima em foto de rosto pode cobrir a cabeça. Prefira embaixo ou dos lados."]);
  return C;
}
function renderPessoa(s){
  renderGroups(s,P_KEYS);
  $("pBgColorWrap").hidden=s.pBg!=="cor";
  $("cenaBox").hidden=true;
  $("bigPreview").innerHTML=drawPerson(s);
  const R=[["IA",G.ai.opts[s.ai].l],["Objetivo",s.pGoal?G.pGoal.opts[s.pGoal].l:"Livre"],["Enquadramento",G.pFrame.opts[s.pFrame].l],["Roupa",G.pOutfit.opts[s.pOutfit].l],["Expressão",G.pExpr.opts[s.pExpr].l],
    ["Fundo",G.pBg.opts[s.pBg].l+(s.pBg==="cor"?" "+BGCOLORS[s.pBgColor].l:"")],["Luz",G.pLight.opts[s.pLight].l+", "+G.pLightColor.opts[s.pLightColor].l.toLowerCase()],["Pele",G.pRetouch.opts[s.pRetouch].l],["Texto",textSummary(s)]];
  $("recipe").innerHTML=R.map(([a,b])=>`<li><span>${a}</span><span>${esc(b)}</span></li>`).join("");
  drawChecks(pChecks(s));
  const fl=G.pFormat.opts[s.pFormat].l, vs=pVariants(s), n=vs.length;
  const BY_AI={
    gemini:[`No Gemini, peça para editar a imagem, anexe a foto da pessoa e cole a Variação A.`,`Ajuste conversando: “clareie o fundo”, “deixe o sorriso mais natural”, “mantenha o rosto igual”.`],
    chatgpt:[`No ChatGPT, clique no + para anexar a foto da pessoa e cole a Variação A.`,`Ajuste conversando: “clareie o fundo”, “mantenha o rosto igual ao original”.`].concat(s.pFormat!=="11"?[`O ChatGPT entrega em retrato 2:3. Recorte para ${fl} no Canva.`]:[]),
    midjourney:[`Arraste a foto da pessoa para a caixa do prompt e use como referência (Omni Reference).`,`Cole a Variação A. O formato já vai no final do prompt (--ar).`],
    leonardo:[`Escolha a proporção ${fl} no painel e adicione a foto da pessoa como referência de imagem.`,`Cole a Variação A no campo do prompt e o negative prompt no campo separado.`],
    ideogram:[`Escolha a proporção ${fl} e, se o seu plano permitir, envie a foto da pessoa como referência.`,`Cole a Variação A no prompt e o negative prompt no campo separado, se aparecer.`],
    outra:[`Se a IA aceitar foto, anexe a foto da pessoa. Escolha a proporção ${fl}, se houver essa opção.`,`Cole a Variação A. Se a IA tiver campo de “negative prompt”, cole ali o que está na linha AVOID.`],
  };
  const steps=[`Escolha uma foto com o rosto bem visível, de frente e com boa luz.`,...BY_AI[s.ai]];
  if(n>1)steps.push(`Gere ${n>2?"as outras variações":"a Variação B"} do mesmo jeito, com a mesma foto, e compare.`);
  if(s.textMode==="edit")steps.push(`No Canva, escreva os textos no espaço livre com a fonte ${G.txtStyle.opts[s.txtStyle].canva}.`);
  steps.push(`Deu certo? Salve na biblioteca abaixo.`);
  $("steps").innerHTML=steps.map(t=>`<li>${esc(t)}</li>`).join("");
  drawTakes(vs.map((v,i)=>({t:`Variação ${"ABCD"[i]}${n>1?" · "+G[s.pVary].opts[v[s.pVary]].l.toLowerCase():""}`,m:`${G.ai.opts[s.ai].l} · ${fl}`,...personPrompt(v)})));
}

function render(){
  const s=get();
  if(!MODULOS[s.mode]||!MODULOS[s.mode].on){s.mode=ON[0];$("mode").value=s.mode}
  document.body.dataset.mode=s.mode;
  $("modeField").hidden=ON.length<2;
  $("modeseg").innerHTML=ON.map(k=>`<button type="button" data-mode="${k}" aria-pressed="${k===s.mode}">${MODULOS[k].label}</button>`).join("");
  $("cenaCustomWrap").hidden=s.cena!=="custom";
  $("txtWrap").hidden=s.mode!=="video"&&s.textMode==="none";
  [["lbHook","txtTitle"],["lbPromessa","txtSub"],["lbOferta","txtBadge"],["lbCta","txtCta"]].forEach(([l,k])=>{$(l).hidden=s.mode!=="video"&&s[k]!=="1"});
  if(s.mode==="img"){renderImg(s);saveDraft(s);return}
  if(s.mode==="pessoa"){renderPessoa(s);saveDraft(s);return}
  $("cenaSlotVid").appendChild($("cenaBox")); $("cenaBox").hidden=false;
  renderGroups(s,["textMode"]);
  const clips=plan(s), n=+s.clips;
  $("tlMeta").textContent=`${n*10} s · ${clips.flat().length} frases · ${n} clipe${n>1?"s":""}`;
  $("timeline").innerHTML=clips.map((bs,ci)=>`<div class="clipcol"><div class="cliphead"><span>Clipe ${ci+1}</span><span>${mmss(ci*10)}–${mmss(ci*10+10)}</span></div><div class="beats">${bs.map(b=>`<div class="beat${b.kind==="CTA"?" cta":""}"><b>${mmss(b.abs0)} ${b.kind}</b>${esc(b.text)}</div>`).join("")||'<div class="beat">sem texto</div>'}</div></div>`).join("");
  drawChecks(checks(s,clips));
  const steps=[`Gere a imagem no Gemini (Nano Banana) com o prompt 0, subindo a foto real da capa. Refaça até a capa sair idêntica.`,
    `No vídeo, selecione 9:16 e suba essa imagem aprovada como referência.`,
    `Cole o Clipe 1. Confira texto, capa e áudio antes de seguir.`];
  if(n>1)steps.push(`Na mesma conversa, cole o Clipe 2${n>2?" e os seguintes, um por vez":""} para continuar o vídeo.`);
  steps.push(`Deu certo? Salve na biblioteca abaixo.`);
  $("steps").innerHTML=steps.map(t=>`<li>${t}</li>`).join("");
  const takes=[{t:"0 · Imagem de referência",m:"Nano Banana · 9:16",p:imagePrompt(s)}];
  clips.forEach((bs,ci)=>takes.push({t:`Clipe ${ci+1}${ci?" · continuação":""}`,m:`${mmss(ci*10)}–${mmss(ci*10+10)}`,p:clipPrompt(s,bs,ci,n)}));
  drawTakes(takes);
  saveDraft(s);
}
function saveDraft(s){try{localStorage.setItem("gg_draft2",JSON.stringify(s))}catch(e){}}
function esc(t){return String(t).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}

function toast(t){const el=$("toast");el.textContent=t;el.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>el.hidden=true,1800)}
async function copy(text,pre){
  try{await navigator.clipboard.writeText(text);toast("Copiado")}
  catch(e){if(pre){const r=document.createRange();r.selectNodeContents(pre);const sel=getSelection();sel.removeAllRanges();sel.addRange(r)}toast("Texto selecionado. Use Ctrl+C.")}
}
$("takes").addEventListener("click",e=>{
  const b=e.target.closest("[data-copy],[data-copyneg]");if(!b)return;
  const neg=b.dataset.copyneg!==undefined, k=window.__takes[+(neg?b.dataset.copyneg:b.dataset.copy)];
  copy(neg?k.neg:k.p,b.closest(".take").querySelectorAll("pre")[neg?1:0]);
});
$("copyAll").addEventListener("click",()=>copy(window.__takes.map(k=>`=== ${k.t} ===\n${k.p}`+(k.neg?`\n\nNEGATIVE PROMPT:\n${k.neg}`:"")).join("\n\n"),null));
$("f").addEventListener("input",render);
$("f").addEventListener("submit",e=>e.preventDefault());
$("modeseg").addEventListener("click",e=>{const b=e.target.closest("[data-mode]");if(b){$("mode").value=b.dataset.mode;render()}});
$("btnExample").addEventListener("click",()=>{const m=$("mode").value;set(m==="img"?(EXAMPLE_KIND[$("preset").value]?{...EXAMPLE_IMG,...PRESETS[$("preset").value],...EXAMPLE_KIND[$("preset").value],preset:$("preset").value}:EXAMPLE_IMG):m==="pessoa"?EXAMPLE_P:{...EXAMPLE,mode:"video"});toast("Exemplo carregado")});
$("btnClear").addEventListener("click",()=>{set({...DEFAULT_IMG,mode:$("mode").value,preset:"",nome:"",visual:"",bonusVis:"",hook:"",promessa:"",benef:"",oferta:"",cta:"",cenaCustom:"",pDesc:"",pGoal:""})});

// biblioteca
function libGet(){try{return JSON.parse(localStorage.getItem("gg_lib")||"[]")}catch(e){return[]}}
function libPut(l){try{localStorage.setItem("gg_lib",JSON.stringify(l))}catch(e){toast("Este navegador não deixou salvar")}}
function libRender(){
  const l=libGet().filter(x=>!x.s.mode||MODULOS[x.s.mode]?.on);
  $("lib").innerHTML=l.length?l.map((x,i)=>`<div class="libitem"><span><b>${esc(x.s.mode==="pessoa"?"Foto de pessoa":(x.s.nome||"Sem nome"))}</b> · ${esc(x.s.mode==="pessoa"?(G.pGoal.opts[x.s.pGoal]?.l||"livre"):(x.s.hook||"").slice(0,48))} · ${esc(x.d)}</span><div><button type="button" data-load="${i}">Carregar</button><button type="button" data-del="${i}">Apagar</button></div></div>`).join(""):'<p class="empty">Nenhum prompt aprovado ainda.</p>';
}
$("saveLib").addEventListener("click",()=>{const l=libGet();l.unshift({s:get(),d:new Date().toLocaleDateString("pt-BR")});libPut(l);libRender();toast("Salvo na biblioteca")});
$("lib").addEventListener("click",e=>{
  const ld=e.target.closest("[data-load]"),dl=e.target.closest("[data-del]");
  const all=libGet(), vis=all.filter(x=>!x.s.mode||MODULOS[x.s.mode]?.on);
  if(ld){set({...DEFAULT_IMG,...vis[+ld.dataset.load].s});toast("Carregado");window.scrollTo({top:0})}
  if(dl){if(dl.dataset.armed){all.splice(all.indexOf(vis[+dl.dataset.del]),1);libPut(all);libRender()}else{dl.dataset.armed=1;dl.textContent="Confirmar"}}
});

let draft=null;try{draft=JSON.parse(localStorage.getItem("gg_draft2")||"null")}catch(e){}
set(draft&&draft.nome!==undefined?{...DEFAULT_IMG,...draft}:{...DEFAULT_IMG,...EXAMPLE_IMG});
libRender();
