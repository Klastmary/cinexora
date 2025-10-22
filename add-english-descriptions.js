const fs = require('fs');

const films = JSON.parse(fs.readFileSync('films.json', 'utf8'));

const englishDescriptions = {
  126: { description: "Batman faces the Joker.", detailedPlot: "Batman, Jim Gordon and Harvey Dent join forces to save Gotham from crime. But the Joker emerges." },
  127: { description: "Survival struggle in a post-apocalyptic world.", detailedPlot: "Max teams up with Furiosa to rescue a group of women in the desert." },
  128: { description: "A retired assassin's revenge story.", detailedPlot: "John Wick goes after those who killed his dog and faces the underworld." },
  129: { description: "The Avengers fight their final battle against Thanos.", detailedPlot: "After the defeat in Infinity War, the Avengers time travel to find Thanos and save the world." },
  130: { description: "A Roman general becomes a gladiator for revenge.", detailedPlot: "After his family is killed, Maximus is sold as a slave and fights in the gladiator arena." },
  131: { description: "A thief who steals secrets from dreams.", detailedPlot: "Dom Cobb is a thief specialized in entering dreams and stealing secrets from people's subconscious." },
  132: { description: "A programmer discovers reality is a simulated world.", detailedPlot: "Neo learns that he lives in a simulation called the Matrix." },
  133: { description: "Astronauts searching for a new home for humanity.", detailedPlot: "Cooper embarks on an interstellar journey to find a new planet for humanity." },
  134: { description: "A replicant hunter faces a new mystery in the future.", detailedPlot: "K is tasked with finding a missing replicant, leading him to a great secret." },
  135: { description: "Power struggle on the desert planet Arrakis.", detailedPlot: "Paul Atreides moves to the dangerous desert planet Arrakis with his family and his destiny changes." },
  136: { description: "Friendship story of two prisoners.", detailedPlot: "Andy Dufresne is imprisoned and becomes friends with Red." },
  137: { description: "Story of a man with low IQ but a good heart.", detailedPlot: "Forrest Gump narrates the important events of his life." },
  138: { description: "Story of a powerful mafia family.", detailedPlot: "Don Vito Corleone transfers control of his mafia empire to his son." },
  139: { description: "A man suffering from insomnia starts a fight club.", detailedPlot: "The narrator meets Tyler Durden and starts an underground fight club." },
  140: { description: "A death row guard and a prisoner with miraculous powers.", detailedPlot: "Paul Edgecomb is a guard on death row and meets a prisoner named John Coffey." },
  141: { description: "A businessman's story of saving Jewish workers during WWII.", detailedPlot: "Oskar Schindler saves lives by employing Jewish workers in his factory during the war." },
  142: { description: "Adventurous story of a concierge and lobby boy at a luxury hotel.", detailedPlot: "Monsieur Gustave H. is accused of murder while working as a hotel manager." },
  143: { description: "A poor family plans to work in a rich family's house.", detailedPlot: "The Kim family starts working in the rich Park family's house and unexpected events occur." },
  144: { description: "Crime stories from LA's underworld.", detailedPlot: "Stories of two hitmen, a boxer and other characters intertwine." },
  145: { description: "Rise and fall story of a Wall Street stockbroker.", detailedPlot: "Jordan Belfort becomes a successful stockbroker on Wall Street but gets involved in illegal activities." },
  146: { description: "Paranormal investigators help a family.", detailedPlot: "Ed and Lorraine Warren are called to help a family that moved into a haunted house." },
  147: { description: "A family faces terrible secrets after mother's death.", detailedPlot: "Annie Graham discovers family secrets after her mother's death." },
  148: { description: "A young man visits his girlfriend's family and discovers terrible secrets.", detailedPlot: "Chris encounters strange events when he goes to his girlfriend's family home." },
  149: { description: "Teenagers face a killer who kills in dreams.", detailedPlot: "Freddy Krueger enters teenagers' dreams and kills them." },
  150: { description: "Those who watch a terrible videotape die after 7 days.", detailedPlot: "Rachel starts investigating her niece's death and discovers a cursed video." },
  151: { description: "Tragic love story that begins on the Titanic.", detailedPlot: "Jack and Rose meet on the Titanic and fall in love." },
  152: { description: "A young lion's journey to become king.", detailedPlot: "After his father's death, Simba struggles to reclaim his kingdom." },
  153: { description: "Secret life of toys.", detailedPlot: "Woody and Buzz Lightyear compete to be their owner's favorite toy." },
  154: { description: "Spider-Man faces multiverse threat.", detailedPlot: "After a spell with Doctor Strange, the multiverse opens." },
  155: { description: "Batman faces the Riddler.", detailedPlot: "Bruce Wayne goes after a serial killer called the Riddler in Gotham city." },
  156: { description: "A comedian's story of becoming the Joker.", detailedPlot: "Arthur Fleck is a comedian rejected by society and becomes the Joker." },
  157: { description: "FBI agent meets Hannibal Lecter to catch a serial killer.", detailedPlot: "Clarice Starling meets Dr. Hannibal Lecter to catch a serial killer called Buffalo Bill." },
  158: { description: "Two detectives investigate murders based on seven deadly sins.", detailedPlot: "Detectives Mills and Somerset try to solve serial murders based on the seven deadly sins." },
  159: { description: "Rivalry of two magicians.", detailedPlot: "Two rival magicians play dangerous games to outdo each other." },
  160: { description: "Revenge story of a man with short-term memory loss.", detailedPlot: "Leonard struggles to find his wife's killer despite short-term memory loss." },
  161: { description: "True story of mafia life.", detailedPlot: "Henry Hill rises and falls in the mafia world." },
  162: { description: "Double agent game between police and mafia.", detailedPlot: "A cop infiltrates the mafia, and a mafioso infiltrates the police." },
  163: { description: "A Cuban immigrant's rise to drug lord.", detailedPlot: "Tony Montana chases power and money in Miami's drug world." },
  164: { description: "Dark world of Las Vegas casinos.", detailedPlot: "Sam Rothstein deals with the mafia and FBI while managing a Las Vegas casino." },
  165: { description: "Cat and mouse game between thief and detective.", detailedPlot: "Professional thief Neil McCauley and detective Vincent Hanna face off." },
  166: { description: "A rescue operation during WWII.", detailedPlot: "A group of soldiers is tasked with finding a soldier lost in war." },
  167: { description: "Dangerous mission of two soldiers during WWI.", detailedPlot: "Two British soldiers must go behind enemy lines to stop an attack." },
  168: { description: "Mission to find a colonel during Vietnam War.", detailedPlot: "Captain Willard is tasked with finding and killing the mad Colonel Kurtz." },
  169: { description: "Survival struggle during Dunkirk evacuation.", detailedPlot: "During WWII, soldiers stranded on Dunkirk beach await rescue." },
  170: { description: "Brutal realities of Vietnam War.", detailedPlot: "A young soldier experiences the horrors of the Vietnam War." },
  171: { description: "Terrifying events at a hotel.", detailedPlot: "Jack Torrance begins to go mad while spending winter with his family in an isolated hotel." },
  172: { description: "Story of a girl possessed by the devil.", detailedPlot: "A young girl is possessed by the devil and two priests try to save her." },
  173: { description: "A terrifying clown hunting children.", detailedPlot: "A group of children fight against a terrifying clown named Pennywise." },
  174: { description: "Alien creature threat in Antarctica.", detailedPlot: "A group of scientists at an Antarctic research station encounter a shape-shifting alien creature." },
  175: { description: "A deadly creature in space.", detailedPlot: "The Nostromo crew encounters a deadly alien creature in space." }
};

films.forEach(film => {
  if (englishDescriptions[film.id]) {
    film.descriptionEn = englishDescriptions[film.id].description;
    film.detailedPlotEn = englishDescriptions[film.id].detailedPlot;
  }
});

fs.writeFileSync('films.json', JSON.stringify(films, null, 2));
console.log('İngilizce açıklamalar eklendi!');
