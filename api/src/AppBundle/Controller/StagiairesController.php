<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use FOS\RestBundle\Controller\Annotations as Rest;
use AppBundle\Form\StagiairesType;
use AppBundle\Entity\Stagiaires;
use AppBundle\Entity\Utilisateurs;

/**
 * Stagiaire controller.
 */
class StagiairesController extends Controller
{
    /**
     * Lists all stagiaire entities.
     *
     * @Rest\View()
     * @Rest\Get("/stagiaires")
     * @Security("has_role(2) || has_role(3) || has_role(1)")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $stagiaires = $em->getRepository('AppBundle:Stagiaires')->findAll();

        return $stagiaires;
    }

    /**
     *
     * @Rest\View()
     * @Rest\Get("/stagiaireinfo/{id}")
     */
    public function stagiaireInfo($id)
    {
        $em = $this->getDoctrine()->getManager();

        $stagiaires = $em->getRepository('AppBundle:Stagiaires')->findOneByIdUtilisateur($id);
        if ($stagiaires)
            return $stagiaires;
        else
            return new JsonResponse(["message_err" => "L'utilisateur est introuvable !"]);

    }

    /**
     * Finds and displays a stagiaire entity.
     *
     * @Rest\View()
     * @Rest\Get("/stagiaires/{id}")
     * @Security("has_role(2) || has_role(3) || has_role(1)")
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $stagiaires = $em->getRepository('AppBundle:Stagiaires')->find($id);

        return $stagiaires;
    }

    /**
     * @Rest\View()
     * @Rest\Patch("/stagiaires/{id}")
     * @Security("has_role(2) || has_role(3) || has_role(0)")
     */
    public function patchStagiairesAction(Request $request)
    {
        return $this->updateStagiaires($request);
    }

    public function updateStagiaires(Request $request)
    {
        $stagiaires = $this->get('doctrine.orm.entity_manager')
        ->getRepository('AppBundle:Stagiaires')
        ->find($request->get('id'));

        if (empty($stagiaires)) {
            return new JsonResponse(['message_err' => "Le stagiaire est introuvable !"], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(StagiairesType::class, $stagiaires);

        $form->submit($request->request->all(), false);

        if ($form->isValid()) {
            $em = $this->get('doctrine.orm.entity_manager');
            if ($this->get('security.token_storage')->getToken()->getRoles() == 0) {
                $stagiaires->setActivation(0);
            }
            $em->persist($stagiaires);
            $em->flush();
            return $stagiaires;
        } else {
            return $form;
        }
    }

    /**
     * Deletes a stagiaire entity.
     *
     * @Rest\View(statusCode=Response::HTTP_NO_CONTENT)
     * @Rest\Delete("/stagiaires/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function deleteAction(Request $request)
    {
        $em = $this->get('doctrine.orm.entity_manager');
        $stagiaires = $em->getRepository('AppBundle:Stagiaires')
        ->find($request->get('id'));

        if ($stagiaires) {
            $em->remove($stagiaires);
            $em->flush();
            return new JsonResponse(["message" => "Le stagiaire a bien été supprimé !"]);
        }
        else
            return new JsonResponse(["message_err" => "Le stagiaire est introuvable !"]);
    }

     /**
     * Activate a stagiaire account.
     * @Rest\Patch("/stagiaires/activation/{id}", name="activationAccount")
     * @Security("has_role(2) || has_role(3)")
     */
     public function activateAccountAction(Request $request)
     {
        $em = $this->get('doctrine.orm.entity_manager');
        $stagiaires = $em->getRepository('AppBundle:Stagiaires')
        ->find($request->get('id'));
        if ($stagiaires) {
            $stagiaires->setActivation(1);
            $em->persist($stagiaires);
            $em->flush();
        }
        else
            return new JsonResponse(["message_err" => "Le stagiaire est introuvable !"]);

        return new JsonResponse(["message" => "Le compte a été activé !"]);
    }
}
