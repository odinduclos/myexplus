<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use FOS\RestBundle\Controller\Annotations as Rest; // alias pour toutes les annotations
use AppBundle\Form\UtilisateursType;
use AppBundle\Entity\Utilisateurs;
use AppBundle\Entity\Stagiaires;
use AppBundle\Entity\MaitresDeStage;
use AppBundle\Entity\AuthToken;


/**
 * Utilisateur controller.
 */
class UtilisateursController extends Controller
{
    /**
     * @Rest\View()
     * @Rest\Get("/utilisateurs")
     * @Security("has_role(2) || has_role(3)")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $utilisateurs = $em->getRepository('AppBundle:Utilisateurs')->findAll();

        /* @var $utilisateurs Utilisateur[] */
        return $utilisateurs;
    }

    /**
     * @Rest\View()
     * @Rest\Get("/utilisateurs/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function getOneUserAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $utilisateurs = $em->getRepository('AppBundle:Utilisateurs')->find($id);

        /* @var $utilisateurs Utilisateur[] */
        return $utilisateurs;
    }

    /**
     * @Rest\View(statusCode=Response::HTTP_CREATED)
     * @Rest\Post("/utilisateurs/new")
     */
    public function createAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $checkIfUnique = $em->getRepository('AppBundle:Utilisateurs')
        ->findByMail($request->get('mail'));
        if ($checkIfUnique !== []) {
            return new JsonResponse(["message_err" => "L'adresse mail est déjà utilisé !"]); 
        }

        $role = $this->get('security.token_storage')->getToken()->getRoles();

        if ($role == []) {
            $role = 0;
        }
        else {
            $role = $role[0]->getRole();
        }

        switch ($request->get('role')) {
            case 1:
            if ($role == 3 || $role == 2) {
                return $this->createMaitreDeStageAction($request);
            }
            break;

            case 2:
            if ($role == 3) {
                return $this->createAdminAction($request);
            }
            break;

            case 3:
            if ($role == 3) {
                return $this->createSuperAdminAction($request);
            }
            break;

            default:
            return $this->createStagiaireAction($request, $role);
            break;
        }
    }

    public function createSuperAdminAction(Request $request)
    {
        $mdp = $this->randomStringAction();
        $utilisateurs = new Utilisateurs();
        $utilisateurs->setMail($request->get('mail'))
        ->setPasswordHash(password_hash($mdp, PASSWORD_BCRYPT))
        ->setRole(3);

        if ($utilisateurs->getMail() == null || $utilisateurs->getPasswordHash() == null) {
            return new JsonResponse(["message_err" => "Tous les champs ne sont pas remplis !"]);
        }
        elseif (!filter_var($utilisateurs->getMail(), FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(["message_err" => "L'adresse mail n'est pas valide !"]);   
        }
        else {
            $em = $this->get('doctrine.orm.entity_manager');
            $em->persist($utilisateurs);
            $em->flush();

            $message = \Swift_Message::newInstance()
            ->setSubject('Compte eplus')
            ->setFrom('eplus.e2c@gmail.com')
            ->setTo($utilisateurs->getMail())
            ->setBody(
                $this->renderView(
                    'emails/inscription_info.html.twig',
                    array(
                        'mail' => $utilisateurs->getMail(),
                        'mdp' => $mdp
                        )
                    ), 'text/html');
            $this->get('mailer')->send($message);
        }

        return $utilisateurs;
    }

    public function createAdminAction(Request $request)
    {
        $mdp = $this->randomStringAction();
        $utilisateurs = new Utilisateurs();
        $utilisateurs->setMail($request->get('mail'))
        ->setPasswordHash(password_hash($mdp, PASSWORD_BCRYPT))
        ->setRole(2);

        if ($utilisateurs->getMail() == null || $utilisateurs->getPasswordHash() == null) {
            return new JsonResponse(["message_err" => "Tous les champs ne sont pas remplis !"]);
        }
        elseif (!filter_var($utilisateurs->getMail(), FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(["message_err" => "L'adresse mail n'est pas valide !"]);   
        }
        else {
            $em = $this->get('doctrine.orm.entity_manager');
            $em->persist($utilisateurs);
            $em->flush();

            $message = \Swift_Message::newInstance()
            ->setSubject('Compte eplus')
            ->setFrom('eplus.e2c@gmail.com')
            ->setTo($utilisateurs->getMail())
            ->setBody(
                $this->renderView(
                    'emails/inscription_info.html.twig',
                    array(
                        'mail' => $utilisateurs->getMail(),
                        'mdp' => $mdp
                        )
                    ), 'text/html');
            $this->get('mailer')->send($message);
        }

        return $utilisateurs;
    }

    public function createMaitreDeStageAction(Request $request)
    {
        $mdp = $this->randomStringAction();
        $utilisateurs = new Utilisateurs();
        $utilisateurs->setMail($request->get('mail'))
        ->setPasswordHash(password_hash($mdp, PASSWORD_BCRYPT))
        ->setRole(1);

        $maitreStage = new MaitresDeStage();
        $maitreStage->setNomEntreprise($request->get('nom_entreprise'));


        if ($utilisateurs->getMail() == null || $utilisateurs->getPasswordHash() == null || $maitreStage->getNomEntreprise() == null) {
            return new JsonResponse(["message_err" => "Tous les champs ne sont pas remplis !"]);
        }
        elseif (!filter_var($utilisateurs->getMail(), FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(["message_err" => "L'adresse mail n'est pas valide !"]);   
        }
        else {
            $em = $this->get('doctrine.orm.entity_manager');
            $em->persist($utilisateurs);
            $em->flush();

            $maitreStage->setIdUtilisateur($utilisateurs);
            $em->persist($maitreStage);
            $em->flush();

            $message = \Swift_Message::newInstance()
            ->setSubject('Compte eplus')
            ->setFrom('eplus.e2c@gmail.com')
            ->setTo($utilisateurs->getMail())
            ->setBody(
                $this->renderView(
                    'emails/inscription_info.html.twig',
                    array(
                        'mail' => $utilisateurs->getMail(),
                        'mdp' => $mdp
                        )
                    ), 'text/html');
            $this->get('mailer')->send($message);
        }

        return $utilisateurs;
    }

    public function createStagiaireAction(Request $request, $role)
    {
        $utilisateurs = new Utilisateurs();
        $utilisateurs->setMail($request->get('mail'))
        ->setPasswordHash(password_hash($request->get('password_hash'), PASSWORD_BCRYPT))
        ->setRole(0);

        $stagiaire = new Stagiaires();
        $stagiaire->setNom($request->get('nom'))
        ->setPrenom($request->get('prenom'));

        if ($utilisateurs->getMail() == null || $utilisateurs->getPasswordHash() == null || $stagiaire->getNom() == null || $stagiaire->getPrenom() == null) {
            return new JsonResponse(["message_err" => "Tous les champs ne sont pas remplis !"]);
        }
        elseif (!filter_var($utilisateurs->getMail(), FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(["message_err" => "L'adresse mail n'est pas valide !"]);   
        }
        else {
            $em = $this->get('doctrine.orm.entity_manager');
            $em->persist($utilisateurs);
            $em->flush();

            $stagiaire->setIdUtilisateur($utilisateurs);
            if ($role == 0) {
                $stagiaire->setActivation(0);    
            }
            else {
               $stagiaire->setActivation(1);   
           }
           $em->persist($stagiaire);
           $em->flush();
       }

       return $utilisateurs;
   }

   public function randomStringAction($length = 10)
   {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

     /**
     * @Rest\View(statusCode=Response::HTTP_NO_CONTENT)
     * @Rest\Delete("/utilisateurs/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
     public function removeUserAction(Request $request)
     {
        $em = $this->get('doctrine.orm.entity_manager');
        $utilisateur = $em->getRepository('AppBundle:Utilisateurs')
        ->find($request->get('id'));
        /* @var $utilisateur Utilisateur */

        if ($utilisateur) {
            $em->remove($utilisateur);
            $em->flush();
            return new JsonResponse(["message" => "L'utilisateur a bien été supprimé !"]);
        }
        else
            return new JsonResponse(["message_err" => "L'utilisateur est introuvable !"]);
    }

    /**
     * @Rest\View()
     * @Rest\Patch("/utilisateurs/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function patchUserAction(Request $request)
    {
        $em = $this->getDoctrine()->getManager();
        $checkIfUnique = $em->getRepository('AppBundle:Utilisateurs')
        ->findByMail($request->get('mail'));
        if ($checkIfUnique !== []) {
            return new JsonResponse(["message_err" => "L'adresse mail est déjà utilisé !"]); 
        }
        return $this->updateUser($request);
    }

    private function updateUser(Request $request)
    {
        $utilisateur = $this->get('doctrine.orm.entity_manager')
        ->getRepository('AppBundle:Utilisateurs')
        ->find($request->get('id'));

        if (empty($utilisateur)) {
            return new JsonResponse(['message_err' => "L'utilisateur est introuvable !"], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(UtilisateursType::class, $utilisateur);

        $form->submit($request->request->all(), false);

        if ($form->isValid()) {
            $em = $this->get('doctrine.orm.entity_manager');
            $utilisateur->setPasswordHash(password_hash($request->get('password_hash'), PASSWORD_BCRYPT));
            if (!filter_var($utilisateur->getMail(), FILTER_VALIDATE_EMAIL)) {
                return new JsonResponse(["message_err" => "L'adresse mail n'est pas valide !"]);   
            }
            $em->persist($utilisateur);
            $em->flush();
            return $utilisateur;
        } else {
            return $form;
        }
    }

    /**
     * @Rest\View()
     * @Rest\Post("/connexion")
     */
    public function connectUserAction(Request $request)
    {
        $em = $this->get('doctrine.orm.entity_manager');
        $utilisateur = $em->getRepository('AppBundle:Utilisateurs')
        ->findOneByMail($request->get('mail'));

        if ($utilisateur) {

            if ($utilisateur->getRole() == 0) {
                $stagiaire = $em->getRepository('AppBundle:Stagiaires')
                ->findOneByIdUtilisateur($utilisateur->getId());

                if ($stagiaire->getActivation() == 0) {
                    return new JsonResponse(["message_err" => "Le compte n'est pas activé"]);
                }
            }

            $utilisateurToken = $em->getRepository('AppBundle:AuthToken')
            ->findOneByUser($utilisateur->getId());

            if ($utilisateurToken) {
                $em->remove($utilisateurToken);
                $em->flush();
            }

            if ($utilisateur->getPasswordHash() == password_verify($request->get('password'), $utilisateur->getPasswordHash())) {

                $authToken = new AuthToken();
                $authToken->setValue(base64_encode(random_bytes(50)));
                $authToken->setCreatedAt(new \DateTime('now'));
                $authToken->setUser($utilisateur);

                $em->persist($authToken);
                $em->flush();

                return $authToken;
            }
            else {
                return new JsonResponse(["message_err" => "Les informations sont incorrectes"]);
            }
        }
        else {
            return new JsonResponse(["message_err" => "Les informations sont incorrectes"]);
        }
    }

    /**
     * @Rest\View()
     * @Rest\Delete("/deconnexion/{id}")
     */
    public function disconnectUserAction(Request $request)
    {
        $em = $this->get('doctrine.orm.entity_manager');
        $authToken = $em->getRepository('AppBundle:AuthToken')
        ->find($request->get('id'));

        $connectedUser = $this->get('security.token_storage')->getToken()->getUser();

        if ($authToken && $authToken->getUser()->getMail() === $connectedUser) {
            $em->remove($authToken);
            $em->flush();
        }
        else
            throw new \Symfony\Component\HttpKernel\Exception\BadRequestHttpException();
    }
}
