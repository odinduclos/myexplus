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
use AppBundle\Form\MaitresDeStageType;
use AppBundle\Entity\MaitresDeStage;
use AppBundle\Entity\Utilisateurs;


/**
 * Maitresdestage controller.
 */
class MaitresDeStageController extends Controller
{
    /**
     * Lists all maitresDeStage entities.
     *
     * @Rest\View()
     * @Rest\Get("/maitresdestage")
     * @Security("has_role(2) || has_role(3) || has_role(1)")
     */
    public function indexAction()
    {
        $em = $this->getDoctrine()->getManager();

        $maitresDeStages = $em->getRepository('AppBundle:MaitresDeStage')->findAll();

        return $maitresDeStages;
    }

    /**
     *
     * @Rest\View()
     * @Rest\Get("/maitresdestageinfo/{id}")
     * @Security("has_role(2) || has_role(3) || has_role(1)")
     */
    public function maitreDeStageInfo($id)
    {
        $em = $this->getDoctrine()->getManager();

        $maitre = $em->getRepository('AppBundle:MaitresDeStage')->findOneByIdUtilisateur($id);
        if ($maitre)
            return $maitre;
        else
            return new JsonResponse(["message_err" => "L'utilisateur est introuvable !"]);
    }

    /**
     *
     * @Rest\View()
     * @Rest\Get("/stageformaitredestage/{id}")
     * @Security("has_role(2) || has_role(3) || has_role(0)")
     */
    public function stageForMaitreDeStage($id)
    {
        $em = $this->getDoctrine()->getManager();

        $maitre = $em->getRepository('AppBundle:StagesMaitresDeStage')->findOneByIdStage($id);
        if ($maitre)
            return $maitre;
        else
            return new JsonResponse(["message_err" => "Le stage est introuvable !"]);
    }

    /**
     * Creates a new maitresDeStage entity.
     *
     * @Rest\View(statusCode=Response::HTTP_CREATED)
     * @Rest\Post("/maitresdestage/new")
     * @Security("has_role(2) || has_role(3)")
     */
    public function newAction(Request $request)
    {
        $maitresDeStage = new Maitresdestage();
        $em = $this->getDoctrine()->getManager();
        $utilisateurs = $em->getRepository('AppBundle:Utilisateurs')->find($request->get('id_utilisateur'));

        $maitresDeStage->setIdUtilisateur($utilisateurs)
        ->setNomEntreprise($request->get('nom_entreprise'));
        if ($maitresDeStage->getIdUtilisateur() == null || $maitresDeStage->getNomEntreprise() == null) {
            return new JsonResponse(["message_err" => "Tous les champs ne sont pas remplis !"]);
        }

        $em = $this->get('doctrine.orm.entity_manager');
        $em->persist($maitresDeStage);
        $em->flush();

        return $maitresDeStage;
    }

    /**
     * Finds and displays a maitresDeStage entity.
     *
     * @Rest\View()
     * @Rest\Get("/maitresdestage/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function showAction($id)
    {
        $em = $this->getDoctrine()->getManager();

        $maitresdestage = $em->getRepository('AppBundle:MaitresDeStage')->find($id);

        return $maitresdestage;
    }

    /**
     * @Rest\View()
     * @Rest\Patch("/maitresdestage/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function patchUserAction(Request $request)
    {
        return $this->updateMaitresDeStage($request);
    }

    public function updateMaitresDeStage(Request $request)
    {
        $maitresdestage = $this->get('doctrine.orm.entity_manager')
        ->getRepository('AppBundle:MaitresDeStage')
        ->find($request->get('id'));

        if (empty($maitresdestage)) {
            return new JsonResponse(['message_err' => "Le maitre de stage est introuvable !"], Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm(MaitresDeStageType::class, $maitresdestage);

        $form->submit($request->request->all(), false);

        if ($form->isValid()) {
            return $maitresdestage;
            $em = $this->get('doctrine.orm.entity_manager');
            $em->persist($maitresdestage);
            $em->flush();
            return $maitresdestage;
        } else {
            return $form;
        }
    }

    /**
     * Deletes a maitresDeStage entity.
     *
     * @Rest\View(statusCode=Response::HTTP_NO_CONTENT)
     * @Rest\Delete("/maitresdestage/{id}")
     * @Security("has_role(2) || has_role(3)")
     */
    public function deleteAction(Request $request)
    {
        $em = $this->get('doctrine.orm.entity_manager');
        $maitresdestage = $em->getRepository('AppBundle:MaitresDeStage')
        ->find($request->get('id'));

        if ($maitresdestage) {
            $em->remove($maitresdestage);
            $em->flush();
            return new JsonResponse(["message" => "Le maitre de stage a bien été supprimé !"]);
        }
        else
            return new JsonResponse(["message_err" => "Le maitre de stage est introuvable !"]);
    }
}
